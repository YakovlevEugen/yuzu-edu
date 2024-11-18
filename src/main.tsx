import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import 'virtual:svg-icons-register'

import { setDefaultOptions } from 'date-fns'
import locale from 'date-fns/locale/ru'

import App from '@/App'
import { Toaster } from '@/components/ui/toaster'

import { RootContextProvider } from '@/providers/root'
import { SWRConfig } from '@/providers/swr'
import { WalletContextProvider } from '@/providers/wallet'

setDefaultOptions({ locale })

if (import.meta.env.VITE_API_HOST === 'msw') {
  const { worker } = await import('./mocks/browser')
  worker.start({
    onUnhandledRequest: 'bypass'
  })
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <SWRConfig>
      <BrowserRouter>
        <RootContextProvider>
          <WalletContextProvider>
            <App />
            <Toaster />
          </WalletContextProvider>
        </RootContextProvider>
      </BrowserRouter>
    </SWRConfig>
  </React.StrictMode>
)
