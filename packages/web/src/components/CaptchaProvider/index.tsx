/* eslint-disable react-refresh/only-export-components */

import {
  type PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState
} from 'react';
import { useTurnstile } from 'react-turnstile';

type ICaptchaContext = {
  token: string | undefined;
  setToken: (val: string) => void;
  reset: () => void;
};

const CaptchaContext = createContext<ICaptchaContext>(
  null as unknown as ICaptchaContext
);

export const useCaptcha = () => useContext(CaptchaContext);

export function CaptchaProvider({ children }: PropsWithChildren) {
  const [token, setToken] = useState<string>();
  const turnstile = useTurnstile();
  const reset = useCallback(() => turnstile.reset(), [turnstile]);
  const value = useMemo(() => ({ token, setToken, reset }), [token, reset]);

  return (
    <CaptchaContext.Provider value={value}>{children}</CaptchaContext.Provider>
  );
}
