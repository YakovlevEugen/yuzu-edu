import type { Address, Hex } from 'viem';

export type ITxRequest = {
  from: Address;
  to: Address;
  data: Hex;
  value?: bigint;
};

export const encodeTxRequest = (req: ITxRequest) =>
  JSON.stringify({
    from: req.from,
    to: req.to,
    data: req.data,
    value: req.value?.toString()
  });

export const decodeTxRequest = (msg: string): ITxRequest => {
  const payload = JSON.parse(msg);
  return {
    from: payload.from as Hex,
    to: payload.to as Hex,
    data: payload.data as Hex,
    value: payload.value ? BigInt(payload.value) : undefined
  };
};
