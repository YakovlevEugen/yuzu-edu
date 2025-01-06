import type { IChainId } from '@yuzu/sdk';
import { useEnv } from './use-environment';

export const useChainId = (): IChainId =>
  useEnv() === 'mainnet' ? 'eduMainnet' : 'eduTestnet';

export const useParentChainId = (): IChainId =>
  useEnv() === 'mainnet' ? 'arbMainnet' : 'arbTestnet';
