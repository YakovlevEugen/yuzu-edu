import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import 'virtual:svg-icons-register'

import { setDefaultOptions } from 'date-fns'
import locale from 'date-fns/locale/en-US'

import { Toaster } from 'ui/toaster'
import App from '@/App'
import { QueryProvider } from '@/providers/QueryProvider'
import { Web3Provider } from '@/providers/Web3Provider'

setDefaultOptions({ locale })

const root = document.getElementById('root') as HTMLElement

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <Web3Provider>
      <QueryProvider>
        <BrowserRouter>
          <App />
          <Toaster />
        </BrowserRouter>
      </QueryProvider>
    </Web3Provider>
  </React.StrictMode>
)
