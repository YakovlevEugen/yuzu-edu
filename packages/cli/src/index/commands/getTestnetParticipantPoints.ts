import type { Address } from 'abitype';
import { getAddressBoost, getTestnetWalletTxs } from '../config';

export const getTestnetParticipantPoints = (address: Address) => {
  // based on address, how much points gets produced?
  return getTestnetWalletTxs(address)
    .then((txs) =>
      txs.map((tx) => getAddressBoost(tx.to?.toLowerCase() as Address))
    )
    .then((points) => points.reduce((mem, elem) => mem + elem, 0));
};
