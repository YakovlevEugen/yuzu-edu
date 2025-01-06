/* eslint-disable react-refresh/only-export-components */

import {
  type PropsWithChildren,
  createContext,
  useContext,
  useEffect
} from 'react';
import { useSearchParams } from 'react-router-dom';
import { useLocalStorage } from 'react-use';

const ReferralContext = createContext<string | undefined>(undefined);
export const useReferral = () => useContext(ReferralContext);

export const ReferralProvider = ({ children }: PropsWithChildren) => {
  const [query] = useSearchParams();
  const [ref, setRef] = useLocalStorage('referral', query.get('ref'));

  useEffect(() => {
    if (query.has('ref')) setRef(query.get('ref'));
  }, [query, setRef]);

  return (
    <ReferralContext.Provider value={ref ?? undefined}>
      {children}
    </ReferralContext.Provider>
  );
};
