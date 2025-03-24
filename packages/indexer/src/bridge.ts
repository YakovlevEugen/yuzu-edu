// const indexArbitrumBlocks = async (c: IContext) => {
//   for (const chain of [arbMainnet]) {
//     console.log(`Indexing ${chain.name}`);

//     const [from, to] = await Promise.all([
//       getLastIndexedBlock(c, chain.name),
//       getPublicClient(toChainId(chain)).getBlockNumber()
//     ]);

//     const blockRanges = toChunks({ from, to, chunkSize: 10000 });

//     for (const { fromBlock, toBlock } of blockRanges) {
//       await indexERC20InboxLogs(c, { chain, fromBlock, toBlock });
//       await setLastIndexedBlock(c, chain.name, toBlock);
//       break;
//     }
//   }
// };

// const indexERC20InboxLogs = async (
//   c: IContext,
//   params: {
//     fromBlock: bigint;
//     toBlock: bigint;
//     chain: IChain;
//   }
// ) => {
//   const { chain, fromBlock, toBlock } = params;

//   const chainId = toChainId(chain);
//   const client = getPublicClient(chainId);

//   const logs = await getERC20InboxDepositsFrom({
//     chainId,
//     fromBlock,
//     toBlock,
//     contracts: [
//       // edu
//       // weth
//       // usdc
//       // usdt
//     ],
//     address: getERC20InboxAddress(chainId)
//   });

//   console.log(`Got: ${logs.length} logs from ${fromBlock} to ${toBlock}`);

//   for (const log of logs.filter((l) => !l.removed)) {
//     const timestamp = await client
//       .getBlock({ blockNumber: log.blockNumber })
//       .then((block) => new Date(Number(block.timestamp) * 1000).toISOString());

//     switch (log.eventName) {
//       case 'Transfer':
//         await Promise.all([
//           upsertWEDUBalance(c, {
//             chain,
//             log,
//             address: log.args.from,
//             amount: log.args.value,
//             timestamp
//           }),
//           upsertWEDUBalance(c, {
//             chain,
//             log,
//             address: log.args.src,
//             amount: -log.args.wad,
//             timestamp
//           })
//         ]);
//         break;
//     }
//   }
// };
