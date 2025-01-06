/* eslint-disable react-refresh/only-export-components */

import { contractsEnv } from '@/constants/config';
import type { IContractsEnv } from '@yuzu/api';
import {
  type PropsWithChildren,
  createContext,
  useContext,
  useEffect
} from 'react';
import { useSearchParams } from 'react-router-dom';
import { useLocalStorage } from 'react-use';

const EnvContext = createContext<IContractsEnv>(contractsEnv);
export const useEnv = () => useContext(EnvContext);
const KEY = 'env';

export const EnvProvider = ({ children }: PropsWithChildren) => {
  const [query] = useSearchParams();

  const [value, setValue] = useLocalStorage<IContractsEnv>(
    KEY,
    (query.get(KEY) as IContractsEnv) ?? contractsEnv
  );

  useEffect(() => {
    if (query.has(KEY)) setValue(query.get(KEY) as IContractsEnv);
  }, [query, setValue]);

  return (
    <EnvContext.Provider value={value as IContractsEnv}>
      {children}
    </EnvContext.Provider>
  );
};
