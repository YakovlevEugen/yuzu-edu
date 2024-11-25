import Big from "big.js";
import { IPointsType } from "./types";

export const estimate = ({
	fromBlock,
	toBlock,
	value,
	type,
}: {
	fromBlock: number;
	toBlock: number;
	value: number;
	type: IPointsType;
}) => {
	const duration = toBlock - fromBlock;
	const amount = new Big(value).div(1e18).toFixed(18);
	const multiplier = type === "stake" ? 1 : 0.1;
	return parseFloat(new Big(duration).mul(amount).mul(multiplier).toFixed());
};
