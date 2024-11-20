import { Context } from "hono";

export type IEnv = {
	Bindings: {};
	Vars: {};
};

export type IContext = Context<IEnv>;
