import { hc } from "hono/client";
import type app from "./";

export const createClient = (baseUrl: string) => hc<typeof app>(baseUrl);

// const client = createClient("http://localhost:3000/");

// (async () => {
// 	const { balance } = await client.wallet[":address"].balance
// 		.$get({ param: { address: "0x1" } })
// 		.then((res) => res.json());

// 	balance;
// })();
