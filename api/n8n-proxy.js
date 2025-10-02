module.exports = async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Headers', 'content-type')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const target = process.env.N8N_SORA_WEBHOOK ||
      'https://n8n.odia.dev/webhook/7ea0ea7f-d542-4f94-ba78-c496b762abf2'

    const bodyText = typeof req.body === 'string' ? req.body : JSON.stringify(req.body || {})

    const upstream = await fetch(target, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: bodyText,
    })

    const text = await upstream.text()
    // Try to return JSON if possible, else text
    try {
      const json = JSON.parse(text)
      return res.status(upstream.status).json(json)
    } catch {
      res.setHeader('Content-Type', 'text/plain; charset=utf-8')
      return res.status(upstream.status).send(text)
    }
  } catch (e) {
    return res.status(500).json({ error: 'Proxy error', detail: e?.message || String(e) })
  }
}
