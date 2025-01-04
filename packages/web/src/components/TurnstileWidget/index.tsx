import { useEffect, useRef } from 'react';

import { cn } from '@/helpers/lib';

interface Props {
  className?: string;
  siteKey?: string;
  theme?: 'light' | 'dark' | 'auto';
  size?: 'normal' | 'compact';
  onVerify: (token: string) => void;
  onError?: (error: string) => void;
  onExpire?: () => void;
}

export default function TurnstileWidget({
  className,
  siteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY,
  theme = 'auto',
  size = 'normal',
  onVerify,
  onError,
  onExpire
}: Props) {
  const turnstileRef = useRef<HTMLDivElement | null>(null);
  const widgetId = useRef<string | null>(null);

  const classRoot = cn('', className);

  useEffect(() => {
    if (window.turnstile && turnstileRef.current && siteKey) {
      widgetId.current = window.turnstile.render(turnstileRef.current, {
        sitekey: siteKey,
        theme,
        size,
        callback: onVerify,
        'error-callback': onError,
        'expired-callback': onExpire
      });
    }

    return () => {
      if (widgetId.current) {
        window.turnstile.remove(widgetId.current);
      }
    };
  }, [siteKey, theme, size, onVerify, onError, onExpire]);

  return <div className={classRoot} ref={turnstileRef} />;
}
