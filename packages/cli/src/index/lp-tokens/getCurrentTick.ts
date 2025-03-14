import { createPublicClient, defineChain } from "viem";

import { camelotPool } from "./abis/camelotPool";
import { sailfishPool } from "./abis/sailfishPool";
import { http } from "viem";
import { whitelistedTokens } from "../../tvl-calculation/constant"
import { camelotPairs, sailfishPairs } from "../../tvl-calculation/constant"

export async function getCurrentTick(contractAddressPool: string) {
    // Determine which ABI to use based on the pool address
    let abi;
    if(Object.keys(camelotPairs).includes(contractAddressPool)) {
        // console.log("Using Camelot ABI")
        abi = camelotPool;
    } else if(Object.keys(sailfishPairs).includes(contractAddressPool)) {
        // console.log("Using Sailfish ABI")
        abi = sailfishPool;
    } else {
        throw new Error("Invalid contract address");
    }

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
    });

    if(Object.keys(camelotPairs).includes(contractAddressPool)) {
        //FUnction to get the current tick for camelot is globalstate
    const data = await publicClient.readContract({
        address: contractAddressPool as `0x${string}`,
        abi: abi,
        functionName: 'globalState',
        });
        const tick = data[1]
        // console.log("Data: ", data)
        // console.log("Tick: ", tick)
        return tick;
    } else if(Object.keys(sailfishPairs).includes(contractAddressPool)) {
        //Function to get the current tick for sailfish is slot0
        const data = await publicClient.readContract({
            address: contractAddressPool as `0x${string}`,
            abi: abi,
            functionName: 'slot0',
        });
        const tick = data[1]
        // console.log("Data: ", data)
        // console.log("Tick: ", tick)
        return tick;
    }

}

getCurrentTick("0x80680b0670a330a99509b68b1273f93864d4ecf4")