/**
 * EDU Testnet / Mainnet Indexing
 */

import { program } from "@commander-js/extra-typings";
import fs from "fs";
import { context } from "../context";
import { countWalletTxs, indexTransactions } from "./helpers";

program
	//
	.command("index")
	.action(async (args) => {
		await indexTransactions(context.chainId);
	});

program
	//
	.command("count-wallet-txs")
	.action(async (args) => {
		const result = await countWalletTxs(context.chainId);
		const filename = `${process.cwd()}/wallet-tx-counts-${new Date().toISOString()}.csv`;

		const lines = Array.from(result.entries())
			.sort((a, b) => (a[1] > b[1] ? -1 : a[1] < b[1] ? 1 : 0))
			.map((pair) => pair.join(","));

		fs.writeFileSync(filename, lines.join("\n"));
		console.log(`Written ${filename}.`);
	});
