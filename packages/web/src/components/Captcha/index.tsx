import { sitekey } from '@/constants/config';
import type { PropsWithChildren } from 'react';
import Turnstile from 'react-turnstile';
import { useCaptcha } from '../CaptchaProvider';

export function Captcha({ children }: PropsWithChildren) {
  const { setToken, token } = useCaptcha();

  if (token) {
    return <>{children}</>;
  } else {
    return <Turnstile sitekey={sitekey} onVerify={setToken} theme={'light'} />;
  }
}
