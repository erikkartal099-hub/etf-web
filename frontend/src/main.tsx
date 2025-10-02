import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './styles/index.css'

// Google Analytics (optional)
const GA_TRACKING_ID = import.meta.env.VITE_GA_TRACKING_ID
const SENTRY_DSN = import.meta.env.VITE_SENTRY_DSN

if (GA_TRACKING_ID) {
  // Load Google Analytics
  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`
  document.head.appendChild(script)

  script.onload = () => {
    window.dataLayer = window.dataLayer || []
    function gtag(...args: any[]) {
      window.dataLayer.push(args)
    }
    gtag('js', new Date())
    gtag('config', GA_TRACKING_ID)
  }
}

// Sentry (optional) - dynamically loaded to avoid hard dependency
if (SENTRY_DSN) {
  (async () => {
    try {
      const Sentry = await import('@sentry/react')
      const { BrowserTracing } = await import('@sentry/tracing')
      Sentry.init({
        dsn: SENTRY_DSN,
        integrations: [new BrowserTracing()],
        tracesSampleRate: 0.2, // adjust in production
      })
    } catch (e) {
      console.warn('Sentry not initialized:', e)
    }
  })()
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
