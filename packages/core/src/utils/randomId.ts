export function randomId(): string {
	/**
	 * randomUUID requires a secure context like https://example.com or http://localhost
	 * It is not available in http://example.com  or http://192.168.x.x
	 */
	return crypto.randomUUID ? crypto.randomUUID() : randomUUIDFallback();
}

/**
 * Alternative for crypto.randomUUID
 * WARNING: It's functionality is not thoroughly tested.
 */
export function randomUUIDFallback(): string {
	return ('' + [1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
		(
			Number(c) ^
			(crypto.getRandomValues(new Uint8Array(1))[0] &
				(15 >> (Number(c) / 4)))
		).toString(16)
	);
}
