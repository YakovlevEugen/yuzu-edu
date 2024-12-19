export function assert(
	statement: unknown,
	message?: string,
): asserts statement {
	if (!statement) {
		throw new Error(message || "Assertion failed");
	}
}
