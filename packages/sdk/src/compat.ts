import { providers } from 'ethers';
import type { Account, Chain, Client, Transport } from 'viem';
import { assert } from './helpers';

class ViemProvider extends providers.JsonRpcProvider {
  publicClient: Client<Transport, Chain>;

  constructor(client: Client<Transport, Chain>) {
    const { chain } = client;
    const connection = chain.rpcUrls.default.http.at(0);
    assert(connection, 'missing rpcUrl');
    super(connection, { chainId: chain.id, name: chain.name });
    this.publicClient = client;
  }

  async send(method: string, params: Array<unknown>): Promise<unknown> {
    const res = await this.publicClient.transport.request({ method, params });
    console.log('request:', { method, params }, 'response:', res);
    return res;
  }
}

export const clientToProvider = (client: Client<Transport, Chain>) =>
  new ViemProvider(client);

export function clientToSigner(client: Client<Transport, Chain, Account>) {
  const { account, chain, transport } = client;
  const rpcUrl = chain.rpcUrls.default.http.at(0);
  assert(rpcUrl, `${chain.name} missing rpc url`);
  return new providers.Web3Provider(transport, {
    chainId: chain.id,
    name: chain.name
  }).getSigner(account.address);
}
