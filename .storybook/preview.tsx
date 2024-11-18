import { initialize, mswLoader } from 'msw-storybook-addon'
import { MemoryRouter } from 'react-router-dom'
// import { reactRouterParameters, withRouter } from 'storybook-addon-remix-react-router'
import type { Preview } from '@storybook/react'
import 'virtual:svg-icons-register'

import { setDefaultOptions } from 'date-fns'
import locale from 'date-fns/locale/ru'

import { mockHandlers } from '@/mocks/handlers'
import { RootContextProvider } from '@/providers/root'
import { SWRConfig } from '@/providers/swr'
import { WalletContextProvider } from '@/providers/wallet'

import '@/assets/styles/index.scss'

setDefaultOptions({ locale })

/*
 * Initializes MSW
 * See https://github.com/mswjs/msw-storybook-addon#configuring-msw
 * to learn how to customize it
 */
initialize({
  onUnhandledRequest: 'bypass'
})

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /date$|week/
      }
    },
    msw: mockHandlers,
    // reactRouter: reactRouterParameters({
    //   routePath: '/',
    //   location: {
    //     searchParams: {
    //       wallet: 'on'
    //     }
    //   }
    // })
  },
  // Provide the MSW addon loader globally
  loaders: [mswLoader],
  decorators: [
    // withRouter,
    (Story) => (
      <SWRConfig>
        <MemoryRouter initialEntries={['/?wallet=on']}>
          <RootContextProvider>
            <WalletContextProvider>
              <Story />
            </WalletContextProvider>
          </RootContextProvider>
        </MemoryRouter>
      </SWRConfig>
    )
  ]
}

export default preview
