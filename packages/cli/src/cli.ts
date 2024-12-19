#!/usr/bin/env -S pnpm tsx

import dotnet from "dotenv";
dotnet.config({ path: `${__dirname}/../.env` });

import { program } from "@commander-js/extra-typings";
import { assign, context } from "./context";
import { mkdirpSync } from "mkdirp";
import { getStoragePath } from "./index/persistence";
import { chains, IChainId } from "@yuzu/sdk";

/**
 * Global options
 */

program
	.option("-v, --verbose", "verbosity level")
	.option("-c, --chain <chainId>", "chain id", "eduTestnet")
	.hook("preSubcommand", (cmd) => {
		const { verbose = false, chain = "eduTestnet" } = cmd.opts();
		assign({
			verbose,
			chainId: chain as IChainId,
			chain: chains[chain as IChainId],
		});
		mkdirpSync(getStoragePath(context.chainId));
	});

/**
 * Mount cli commands
 */

import "./index";

/**
 * Parse cli args
 */

program.parse(process.argv);
