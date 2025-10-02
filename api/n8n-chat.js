const DEFAULT_CHAT_WEBHOOK_ID = '0c73e08e-5cfd-46e8-a0a0-82997aca74c0'
const DEFAULT_CHAT_BASE_URL = 'https://n8n.odia.dev/chat'

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Headers', 'content-type')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const chatWebhookId = process.env.N8N_CHAT_WEBHOOK_ID || DEFAULT_CHAT_WEBHOOK_ID
  const chatBaseUrl = (process.env.N8N_CHAT_BASE_URL || DEFAULT_CHAT_BASE_URL).replace(/\/$/, '')
  const target = `${chatBaseUrl}/${chatWebhookId}`

  try {
    const bodyText = typeof req.body === 'string' ? req.body : JSON.stringify(req.body || {})
    if (!bodyText || bodyText === '{}') {
      return res.status(400).json({ error: 'Missing request body' })
    }

    const upstream = await fetch(target, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: bodyText,
    })

    const responseText = await upstream.text()
    let responseJson
    try {
      responseJson = responseText ? JSON.parse(responseText) : null
    } catch (e) {
      responseJson = null
    }

    if (!upstream.ok) {
      return res.status(upstream.status).json(
        responseJson || {
          error: 'n8n chat endpoint returned an error',
          status: upstream.status,
          body: responseText,
        }
      )
    }

    const message =
      responseJson?.message ||
      responseJson?.text ||
      responseJson?.response ||
      responseJson?.output

    if (!message) {
      return res.status(200).json({
        message: "I'm having trouble responding right now. Please try again in a moment! 🙏",
        raw: responseJson ?? responseText,
      })
    }

    return res.status(200).json({
      ...responseJson,
      message,
    })
  } catch (error) {
    return res.status(500).json({
      error: 'Proxy error',
      detail: error?.message || String(error),
    })
  }
}
