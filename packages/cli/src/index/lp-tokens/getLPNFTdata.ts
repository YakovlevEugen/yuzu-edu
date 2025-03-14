import { createPublicClient, defineChain, http } from 'viem'
import { sailfishLPNFT } from './abis/sailfishLPNFT'
import { calculatePositionValue } from './calculatePositionValue'

export type LPNFTData = {
  nounce: number
  operator: string
  token0: string
  token1: string
  fee: number
  tickLower: number
  tickUpper: number
  liquidity: bigint
  feeGrowthInside0LastX128: bigint
  feeGrowthInside1LastX128: bigint
  tokensOwed0: bigint
  tokensOwed1: bigint
}


export const getLPNFTdata = async ({
    positionID,
    contractAddressLPNFT
}: {
    positionID: number,
    contractAddressLPNFT: string
}) => {

    const edumainnetchain = defineChain({
  id: 41923,
  name: 'EDU Mainnet',
  nativeCurrency: {
    decimals: 18,
    name: 'EDU',
    symbol: 'EDU'
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.edu-chain.raas.gelato.cloud'],
      webSocket: ['wss://ws.edu-chain.raas.gelato.cloud']
    }
  },
  blockExplorers: {
    default: {
      name: 'Explorer',
      url: 'https://educhain.blockscout.com/'
    }
  },    
});

    const publicClient = createPublicClient({ 
        chain: edumainnetchain,
        transport: http()
      })

     
      const data = await publicClient.readContract({
        address: contractAddressLPNFT as `0x${string}`,
        abi: sailfishLPNFT,
        functionName: 'positions',
        args: [
           BigInt(positionID)
        ]
      })


      const LPNFTData = {
        nonce: String(data[0]),
        operator: data[1],
        token0: data[2],
        token1: data[3],
        fee: data[4],
        tickLower: data[5],
        tickUpper: data[6],
        liquidity: String(data[7]),
        feeGrowthInside0LastX128: String(data[8]),
        feeGrowthInside1LastX128: String(data[9]),
        tokensOwed0: String(data[10]),
        tokensOwed1: String(data[11])
      }


      console.log(LPNFTData)

      return LPNFTData
     
    
}

