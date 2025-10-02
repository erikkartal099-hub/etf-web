// Authentication context using Supabase Auth

import React, { createContext, useContext, useEffect, useState } from 'react'
import { supabase, handleSupabaseError } from '@/lib/supabase'
import { checkDailyLoginBonus } from '@/lib/api'
import type { User, AuthContextType } from '@/types'
import toast from 'react-hot-toast'

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      if (session?.user) {
        loadUserProfile(session.user.id)
      } else {
        setLoading(false)
      }
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session)
      if (session?.user) {
        await loadUserProfile(session.user.id)
        
        // Check for daily login bonus
        try {
          await checkDailyLoginBonus(session.user.id)
        } catch (error) {
          // Silent fail - bonus already claimed today
        }
      } else {
        setUser(null)
        setLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  async function loadUserProfile(userId: string) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        // If profile doesn't exist, create it
        if (error.code === 'PGRST116') {
          console.log('Profile not found, creating one...')
          
          // Get auth user data
          const { data: authUser } = await supabase.auth.getUser()
          
          if (authUser?.user) {
            // Create profile
            const { data: newProfile, error: createError } = await supabase
              .from('users')
              .insert({
                id: userId,
                email: authUser.user.email,
                full_name: authUser.user.user_metadata?.full_name || authUser.user.email,
              })
              .select()
              .single()
            
            if (createError) {
              console.error('Failed to create profile:', createError)
              throw createError
            }
            
            setUser(newProfile)
            toast.success('Profile created successfully')
            return
          }
        }
        throw error
      }
      
      setUser(data)
    } catch (error: any) {
      console.error('Error loading user profile:', error)
      const message = error.code === 'PGRST301' 
        ? 'Database permission error. Please contact support.' 
        : 'Failed to load user profile. Please try refreshing the page.'
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  async function signIn(email: string, password: string) {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error
      toast.success('Welcome back!')
    } catch (error: any) {
      const message = handleSupabaseError(error)
      toast.error(message)
      throw error
    }
  }

  async function signUp(
    email: string,
    password: string,
    fullName: string,
    referralCode?: string
  ) {
    try {
      // Find referrer by referral code (if provided)
      let referrerId = null
      if (referralCode) {
        const { data: referrer } = await supabase
          .from('users')
          .select('id')
          .eq('referral_code', referralCode)
          .single()

        referrerId = referrer?.id
      }

      // Sign up with Supabase Auth - the trigger will automatically create the user profile
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          // Send email verification to our callback route
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: {
            full_name: fullName,
            referred_by: referrerId, // Pass referrer info in metadata
          }
        }
      })

      if (authError) throw authError
      if (!authData.user) throw new Error('Failed to create user')

      toast.success('Account created successfully! Please check your email to verify.')
    } catch (error: any) {
      const message = handleSupabaseError(error)
      toast.error(message)
      throw error
    }
  }

  async function signOut() {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      
      setUser(null)
      setSession(null)
      toast.success('Signed out successfully')
    } catch (error: any) {
      const message = handleSupabaseError(error)
      toast.error(message)
      throw error
    }
  }

  async function updateProfile(updates: Partial<User>) {
    if (!user) throw new Error('No user logged in')

    try {
      const { error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', user.id)

      if (error) throw error

      setUser({ ...user, ...updates })
      toast.success('Profile updated successfully')
    } catch (error: any) {
      const message = handleSupabaseError(error)
      toast.error(message)
      throw error
    }
  }

  const value: AuthContextType = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    updateProfile,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
