export {}

declare global {
  interface Window {
    turnstile: {
      render: (
        element: HTMLElement,
        options: {
          sitekey: string
          theme?: 'light' | 'dark' | 'auto'
          size?: 'normal' | 'compact'
          tabindex?: number
          callback?: (token: string) => void
          'expired-callback'?: () => void
          'error-callback'?: (error: string) => void
        }
      ) => string // Returns widget ID
      reset: (widgetId?: string) => void
      remove: (widgetId?: string) => void
    }
  }
}
