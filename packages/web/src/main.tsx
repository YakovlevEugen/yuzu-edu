import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import 'virtual:svg-icons-register';

import { setDefaultOptions } from 'date-fns';
import { enUS } from 'date-fns/locale/en-US';

import App from '@/App';
import { QueryProvider } from '@/providers/QueryProvider';
import { Web3Provider } from '@/providers/Web3Provider';
import { Toaster } from 'ui/toaster';
import { EnvProvider } from './hooks/use-environment';
import { ReferralProvider } from './hooks/use-referral';

setDefaultOptions({ locale: enUS });

const root = document.getElementById('root') as HTMLElement;

ReactDOM.createRoot(root).render(
  <React.StrictMode>
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
  </React.StrictMode>
);
