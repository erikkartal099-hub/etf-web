// Supabase Edge Function: Send Notification
// Sends email notifications to users

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface NotificationRequest {
  userId: string
  type: 'email' | 'push' | 'sms'
  subject?: string
  message: string
  template?: string
  data?: Record<string, any>
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    )

    const { userId, type, subject, message, template, data }: NotificationRequest = await req.json()

    // Get user details
    const { data: user, error: userError } = await supabaseClient
      .from('users')
      .select('email, full_name')
      .eq('id', userId)
      .single()

    if (userError) {
      throw new Error(`Failed to fetch user: ${userError.message}`)
    }

    // Send notification based on type
    let result
    if (type === 'email') {
      result = await sendEmail(user.email, user.full_name, subject || 'CoinDesk ETF Notification', message, template, data)
    } else if (type === 'push') {
      result = await sendPushNotification(userId, message)
    } else if (type === 'sms') {
      result = await sendSMS(user, message)
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Notification sent successfully',
        result,
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error sending notification:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

// Send email using SendGrid or similar service
async function sendEmail(
  to: string,
  name: string,
  subject: string,
  message: string,
  template?: string,
  data?: Record<string, any>
): Promise<any> {
  const SENDGRID_API_KEY = Deno.env.get('SENDGRID_API_KEY')
  
  if (!SENDGRID_API_KEY) {
    console.warn('SendGrid API key not configured, email not sent')
    return { simulated: true }
  }

  // Use template if provided, otherwise plain text
  const emailContent = template 
    ? generateEmailFromTemplate(template, data || {})
    : message

  try {
    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SENDGRID_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        personalizations: [{
          to: [{ email: to, name }],
          subject,
        }],
        from: {
          email: 'notifications@coindesketf.com',
          name: 'CoinDesk Crypto 5 ETF'
        },
        content: [{
          type: 'text/html',
          value: emailContent,
        }],
      }),
    })

    if (!response.ok) {
      throw new Error(`SendGrid error: ${response.statusText}`)
    }

    return { sent: true, provider: 'sendgrid' }
  } catch (error) {
    console.error('Failed to send email:', error)
    throw error
  }
}

// Send push notification (placeholder)
async function sendPushNotification(userId: string, message: string): Promise<any> {
  // In production, integrate with Firebase Cloud Messaging or similar
  console.log(`Push notification to ${userId}: ${message}`)
  return { simulated: true }
}

// Send SMS (placeholder)
async function sendSMS(user: any, message: string): Promise<any> {
  // In production, integrate with Twilio or similar
  console.log(`SMS to ${user.phone}: ${message}`)
  return { simulated: true }
}

// Generate email from template
function generateEmailFromTemplate(template: string, data: Record<string, any>): string {
  const templates: Record<string, (data: any) => string> = {
    welcome: (d) => `
      <html>
        <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0;">Welcome to CoinDesk Crypto 5 ETF</h1>
          </div>
          <div style="padding: 30px; background: #f8f9fa;">
            <h2>Hello ${d.name}!</h2>
            <p>Thank you for joining CoinDesk Crypto 5 ETF by Grayscale Investment.</p>
            <p>Your account is now active and ready to start investing in cryptocurrency ETFs.</p>
            <p><strong>Your Referral Code:</strong> <code style="background: #e9ecef; padding: 5px 10px; border-radius: 4px;">${d.referralCode}</code></p>
            <p>Share your referral link and earn up to 10% bonus on referred deposits!</p>
            <a href="${d.dashboardUrl}" style="display: inline-block; background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 20px;">
              Go to Dashboard
            </a>
          </div>
          <div style="padding: 20px; text-align: center; color: #6c757d; font-size: 12px;">
            <p>© 2025 CoinDesk Crypto 5 ETF. All rights reserved.</p>
          </div>
        </body>
      </html>
    `,
    deposit: (d) => `
      <html>
        <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="padding: 30px; background: #f8f9fa;">
            <h2>Deposit Confirmed ✓</h2>
            <p>Your deposit has been successfully processed.</p>
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p><strong>Amount:</strong> ${d.amount} ${d.crypto}</p>
              <p><strong>USD Value:</strong> $${d.usdValue}</p>
              <p><strong>ETF Tokens Minted:</strong> ${d.etfTokens}</p>
              <p><strong>Transaction Hash:</strong> <code style="font-size: 11px;">${d.txHash}</code></p>
            </div>
            <a href="${d.portfolioUrl}" style="display: inline-block; background: #28a745; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">
              View Portfolio
            </a>
          </div>
        </body>
      </html>
    `,
    referral: (d) => `
      <html>
        <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="padding: 30px; background: #f8f9fa;">
            <h2>🎉 Referral Bonus Earned!</h2>
            <p>Great news! You've earned a referral bonus.</p>
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p><strong>Bonus Amount:</strong> ${d.bonusAmount} ETF tokens</p>
              <p><strong>Level:</strong> ${d.level}</p>
              <p><strong>Referred User:</strong> ${d.referredUser}</p>
            </div>
            <p>Keep inviting friends to earn more bonuses!</p>
            <a href="${d.referralUrl}" style="display: inline-block; background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">
              View Referral Tree
            </a>
          </div>
        </body>
      </html>
    `,
  }

  const templateFunc = templates[template]
  if (!templateFunc) {
    return `<p>${data.message || 'Notification from CoinDesk ETF'}</p>`
  }

  return templateFunc(data)
}

/* To deploy this function:
cd supabase
supabase functions deploy send-notification

Set environment variable in Supabase dashboard:
SENDGRID_API_KEY=your_sendgrid_api_key
*/
