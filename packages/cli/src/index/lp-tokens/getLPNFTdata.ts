import { createPublicClient, defineChain, http } from 'viem'
import { sailfishLPNFT } from './abis/sailfishLPNFT'
import { camelotLPNFT } from './abis/camelotLPNFT'
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

      const isSailfish = contractAddressLPNFT.toLowerCase() === "0x79cc7deA5eE05735a7503A32Dc4251C7f79F3Baf".toLowerCase();

     
      const data = await publicClient.readContract({
        address: contractAddressLPNFT as `0x${string}`,
        abi: isSailfish ? sailfishLPNFT : camelotLPNFT,
        functionName: 'positions',
        args: [
           BigInt(positionID)
        ]
      })



      let LPNFTData 

      if (isSailfish) {
        LPNFTData = {
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
      } else {
        LPNFTData = {
          nonce: String(data[0]),
          operator: data[1],
          token0: data[2],
          token1: data[3],
          tickLower: data[4],
          tickUpper: data[5],
          liquidity: String(data[6]),
          feeGrowthInside0LastX128: String(data[7]),
          feeGrowthInside1LastX128: String(data[8]),
          tokensOwed0: String(data[9]),
          tokensOwed1: String(data[10])
      }
      // nonce (uint96) : 0

      // operator (address) : 0x0000000000000000000000000000000000000000

      // token0 (address) : 0x836d275563bAb5E93Fd6Ca62a95dB7065Da94342

      // token1 (address) : 0xd02E8c38a8E3db71f8b2ae30B8186d7874934e12

      // tickLower (int24) : 291660

      // tickUpper (int24) : 293040

      // liquidity (uint128) : 415367341676023

      // feeGrowthInside0LastX128 (uint256) : 0

      // feeGrowthInside1LastX128 (uint256) : 49584319494743244612554993959856430294270

      // tokensOwed0 (uint128) : 0

      // tokensOwed1 (uint128) : 0


      // console.log(LPNFTData)
   
     
    }


    return LPNFTData
    
}

