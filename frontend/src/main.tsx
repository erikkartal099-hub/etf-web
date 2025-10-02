import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './styles/index.css'

// Google Analytics (optional)
const GA_TRACKING_ID = import.meta.env.VITE_GA_TRACKING_ID

if (GA_TRACKING_ID) {
  // Load Google Analytics
  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`
  document.head.appendChild(script)

  script.onload = () => {
    ;(window as any).dataLayer = (window as any).dataLayer || []
    function gtag(...args: any[]) {
      ;(window as any).dataLayer.push(args)
    }
    gtag('js', new Date())
    gtag('config', GA_TRACKING_ID)
  }
}

// Optional Sentry hint (no package installed by default)
const SENTRY_DSN = import.meta.env.VITE_SENTRY_DSN
if (SENTRY_DSN) {
  // eslint-disable-next-line no-console
  console.info(
    '\nSentry DSN detected. To enable Sentry later, install @sentry/react and initialize it in main.tsx.\n' +
      'Example:\n' +
      "  import * as Sentry from '@sentry/react'\n" +
      '  Sentry.init({ dsn: import.meta.env.VITE_SENTRY_DSN })\n'
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
