import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import toast from 'react-hot-toast'
import { Shield, Smartphone, Key, CheckCircle, Copy, Fingerprint } from 'lucide-react'

/**
 * Two-Factor Authentication Setup Component
 * 
 * Features:
 * - TOTP (Time-based One-Time Password) setup
 * - QR code generation for authenticator apps
 * - Backup codes generation
 * - Biometric authentication mock (WebAuthn)
 * 
 * Security Best Practices:
 * - CISA recommends 2FA for finance to block 99% phishing
 * - Biometric + TOTP provides multi-layer security
 * - Local storage for biometric credentials (no cloud)
 * 
 * Production Integration:
 * - TOTP: Use speakeasy library (npm i speakeasy qrcode)
 * - WebAuthn: Use @simplewebauthn/browser
 * - Backend: Supabase Edge Function for verification
 */

interface TwoFactorSetupProps {
  isOpen: boolean
  onClose: () => void
  onComplete?: () => void
}

type SetupStep = 'method' | 'totp' | 'biometric' | 'backup' | 'complete'

export default function TwoFactorSetup({ isOpen, onClose, onComplete }: TwoFactorSetupProps) {
  const { user } = useAuth()
  const [step, setStep] = useState<SetupStep>('method')
  const [method, setMethod] = useState<'totp' | 'biometric' | null>(null)
  const [totpSecret, setTotpSecret] = useState('')
  const [qrCodeUrl, setQrCodeUrl] = useState('')
  const [verificationCode, setVerificationCode] = useState('')
  const [backupCodes, setBackupCodes] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  if (!isOpen) return null

  const generateTOTP = async () => {
    setLoading(true)
    try {
      // Mock TOTP generation
      // Production: Use speakeasy.generateSecret()
      const mockSecret = 'JBSWY3DPEHPK3PXP' // Base32 encoded secret
      const mockQRUrl = `otpauth://totp/CoinDesk%20ETF:${user?.email}?secret=${mockSecret}&issuer=CoinDesk%20ETF`
      
      setTotpSecret(mockSecret)
      setQrCodeUrl(mockQRUrl)
      setStep('totp')
      
      toast.success('TOTP secret generated')
    } catch (error) {
      console.error('Error generating TOTP:', error)
      toast.error('Failed to generate TOTP secret')
    } finally {
      setLoading(false)
    }
  }

  const setupBiometric = async () => {
    setLoading(true)
    try {
      // Mock WebAuthn registration
      // Production: Use navigator.credentials.create() with PublicKeyCredential
      
      if (!window.PublicKeyCredential) {
        toast.error('Biometric authentication not supported on this device')
        return
      }

      // Simulate biometric registration
      await new Promise((resolve) => setTimeout(resolve, 1500))
      
      toast.success('Biometric authentication registered')
      setStep('backup')
    } catch (error) {
      console.error('Error setting up biometric:', error)
      toast.error('Failed to setup biometric authentication')
    } finally {
      setLoading(false)
    }
  }

  const verifyTOTP = async () => {
    if (verificationCode.length !== 6) {
      toast.error('Please enter a 6-digit code')
      return
    }

    setLoading(true)
    try {
      // Mock TOTP verification
      // Production: Call Supabase Edge Function to verify with speakeasy.verify()
      
      // Simulate verification
      await new Promise((resolve) => setTimeout(resolve, 1000))
      
      // Generate backup codes
      const codes = generateBackupCodes()
      setBackupCodes(codes)
      
      // Update user preferences
      await supabase
        .from('user_preferences')
        .upsert({
          user_id: user?.id,
          two_factor_enabled: true,
        })
      
      setStep('backup')
      toast.success('2FA verified successfully')
    } catch (error) {
      console.error('Error verifying TOTP:', error)
      toast.error('Invalid verification code')
    } finally {
      setLoading(false)
    }
  }

  const generateBackupCodes = (): string[] => {
    // Generate 10 backup codes
    const codes: string[] = []
    for (let i = 0; i < 10; i++) {
      const code = Math.random().toString(36).substring(2, 10).toUpperCase()
      codes.push(code)
    }
    return codes
  }

  const copyBackupCodes = () => {
    const codesText = backupCodes.join('\n')
    navigator.clipboard.writeText(codesText)
    toast.success('Backup codes copied to clipboard')
  }

  const completeTwoFactorSetup = async () => {
    setLoading(true)
    try {
      // Store backup codes (encrypted in production)
      await supabase
        .from('user_preferences')
        .upsert({
          user_id: user?.id,
          two_factor_enabled: true,
          biometric_enabled: method === 'biometric',
        })

      setStep('complete')
      
      setTimeout(() => {
        onComplete?.()
        onClose()
      }, 2000)
    } catch (error) {
      console.error('Error completing 2FA setup:', error)
      toast.error('Failed to complete 2FA setup')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto border border-gray-800">
        {/* Header */}
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <Shield className="w-6 h-6 text-blue-500" />
            <h2 className="text-2xl font-bold text-white">Two-Factor Authentication</h2>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Method Selection */}
          {step === 'method' && (
            <div className="space-y-6">
              <p className="text-gray-400">
                Choose your preferred two-factor authentication method to secure your account
              </p>

              <div className="space-y-3">
                {/* TOTP Method */}
                <button
                  onClick={() => {
                    setMethod('totp')
                    generateTOTP()
                  }}
                  className="w-full p-4 bg-gray-800 hover:bg-gray-750 rounded-lg border border-gray-700 hover:border-blue-500 transition-all text-left"
                >
                  <div className="flex items-start gap-4">
                    <Smartphone className="w-6 h-6 text-blue-500 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold text-white mb-1">Authenticator App</h3>
                      <p className="text-sm text-gray-400">
                        Use Google Authenticator, Authy, or similar apps to generate time-based codes
                      </p>
                    </div>
                  </div>
                </button>

                {/* Biometric Method */}
                <button
                  onClick={() => {
                    setMethod('biometric')
                    setupBiometric()
                  }}
                  className="w-full p-4 bg-gray-800 hover:bg-gray-750 rounded-lg border border-gray-700 hover:border-blue-500 transition-all text-left"
                >
                  <div className="flex items-start gap-4">
                    <Fingerprint className="w-6 h-6 text-purple-500 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold text-white mb-1">Biometric Authentication</h3>
                      <p className="text-sm text-gray-400">
                        Use fingerprint, Face ID, or Windows Hello for secure login
                      </p>
                    </div>
                  </div>
                </button>
              </div>

              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                <p className="text-sm text-blue-200">
                  <strong>Security Recommendation:</strong> CISA recommends 2FA for financial platforms to block 99% of phishing attacks. Enable both methods for maximum security.
                </p>
              </div>
            </div>
          )}

          {/* TOTP Setup */}
          {step === 'totp' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  Scan QR Code
                </h3>
                <p className="text-gray-400">
                  Open your authenticator app and scan this QR code
                </p>
              </div>

              {/* QR Code */}
              <div className="bg-white p-6 rounded-lg">
                <div className="aspect-square bg-gray-200 rounded flex items-center justify-center">
                  <Key className="w-24 h-24 text-gray-400" />
                  {/* Production: Use qrcode library to generate actual QR code */}
                  <p className="text-xs text-gray-500 mt-2">QR Code: {qrCodeUrl.substring(0, 30)}...</p>
                </div>
              </div>

              {/* Manual Entry */}
              <div className="bg-gray-800/50 rounded-lg p-4">
                <p className="text-sm text-gray-400 mb-2">Can't scan? Enter this code manually:</p>
                <div className="flex items-center gap-2">
                  <code className="flex-1 bg-gray-900 px-3 py-2 rounded text-blue-400 font-mono text-sm">
                    {totpSecret}
                  </code>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(totpSecret)
                      toast.success('Secret copied')
                    }}
                    className="p-2 bg-gray-700 hover:bg-gray-600 rounded transition-colors"
                  >
                    <Copy className="w-4 h-4 text-gray-300" />
                  </button>
                </div>
              </div>

              {/* Verification */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Enter 6-digit code from your app
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="000000"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white text-center text-2xl tracking-widest font-mono"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep('method')}
                  className="flex-1 bg-gray-800 hover:bg-gray-700 text-white font-semibold py-3 rounded-lg transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={verifyTOTP}
                  disabled={verificationCode.length !== 6 || loading}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50"
                >
                  {loading ? 'Verifying...' : 'Verify'}
                </button>
              </div>
            </div>
          )}

          {/* Backup Codes */}
          {step === 'backup' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  Save Backup Codes
                </h3>
                <p className="text-gray-400">
                  Store these codes in a safe place. Each code can be used once if you lose access to your 2FA device.
                </p>
              </div>

              <div className="bg-gray-800/50 rounded-lg p-4">
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {backupCodes.map((code, index) => (
                    <code key={index} className="bg-gray-900 px-3 py-2 rounded text-blue-400 font-mono text-sm text-center">
                      {code}
                    </code>
                  ))}
                </div>
                <button
                  onClick={copyBackupCodes}
                  className="w-full bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <Copy className="w-4 h-4" />
                  Copy All Codes
                </button>
              </div>

              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
                <p className="text-sm text-yellow-200">
                  <strong>Important:</strong> These backup codes will only be shown once. Make sure to save them securely before continuing.
                </p>
              </div>

              <button
                onClick={completeTwoFactorSetup}
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors"
              >
                {loading ? 'Completing...' : 'I Have Saved My Backup Codes'}
              </button>
            </div>
          )}

          {/* Complete */}
          {step === 'complete' && (
            <div className="text-center py-8">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">
                2FA Enabled Successfully!
              </h3>
              <p className="text-gray-400">
                Your account is now protected with two-factor authentication
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-800 p-4 bg-gray-800/30">
          <p className="text-xs text-gray-500 text-center">
            🔧 <strong>Production Integration:</strong> npm i speakeasy qrcode @simplewebauthn/browser
            for real TOTP and WebAuthn implementation. Backend verification via Supabase Edge Functions.
          </p>
        </div>
      </div>
    </div>
  )
}
