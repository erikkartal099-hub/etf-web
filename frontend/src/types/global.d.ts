// Global ambient types

export {}

declare global {
  interface Window {
    dataLayer: any[]
  }
}

declare module '@sentry/react' {
  const Sentry: any
  export default Sentry
}

declare module '@sentry/tracing' {
  export const BrowserTracing: any
}
