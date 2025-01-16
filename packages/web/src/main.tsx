import { setDefaultOptions } from 'date-fns';
import { enUS } from 'date-fns/locale/en-US';
import { PostHogProvider } from 'posthog-js/react';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import 'virtual:svg-icons-register';

import App from '@/App';
import { postHogHost, postHogKey } from '@/constants/config';
import { QueryProvider } from '@/providers/QueryProvider';
import { Web3Provider } from '@/providers/Web3Provider';
import { Toaster } from 'ui/toaster';
import { EnvProvider } from './hooks/use-environment';
import { ReferralProvider } from './hooks/use-referral';

setDefaultOptions({ locale: enUS });

const root = document.getElementById('root') as HTMLElement;

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <PostHogProvider apiKey={postHogKey} options={{ api_host: postHogHost }}>
      <EnvProvider>
        <Web3Provider>
          <QueryProvider>
            <BrowserRouter>
              <ReferralProvider>
                <App />
                <Toaster />
              </ReferralProvider>
            </BrowserRouter>
          </QueryProvider>
        </Web3Provider>
      </EnvProvider>
    </PostHogProvider>
  </React.StrictMode>
);
