import { SupabaseClient } from "@supabase/supabase-js";
import { Context } from "hono";
import { Database } from "@yuzu/supabase";

export type IEnv = {
	Bindings: {
		SUPABASE_URL: string;
		SUPABASE_KEY: string;
		CONTRACTS_ENV: "mainnet" | "testnet";
	};
	Variables: {
		db: SupabaseClient<Database>;
		mainnet: boolean;
	};
};

export type IContext = Context<IEnv>;
export type IPointsType = "stake" | "bridge";
