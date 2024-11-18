import { MemoryRouter } from 'react-router-dom'
import type { Preview } from '@storybook/react'
import 'virtual:svg-icons-register'

import { setDefaultOptions } from 'date-fns'
import locale from 'date-fns/locale/en-US'

import { QueryProvider } from '@/providers/QueryProvider'
import { Web3Provider } from '@/providers/Web3Provider'

import '@/assets/styles/index.scss'

setDefaultOptions({ locale })

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /date$|week/
      }
    }
  },
  decorators: [
    (Story) => (
      <Web3Provider>
        <QueryProvider>
          <MemoryRouter initialEntries={['/']}>
            <Story />
          </MemoryRouter>
        </QueryProvider>
      </Web3Provider>
    )
  ]
}

export default preview
