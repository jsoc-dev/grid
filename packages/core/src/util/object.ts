/**
 * Extracts a subset of keys from a source type.
 * It is for type safety when defining a subset of keys from an object.
 * Ensures the provided keys exist on S.
 *
 * @example
 * type Person = { name: string, user: string; pass: string; };
 * type personSecretFields = SubsetKeysOf<Person, 'user' | 'pass'>;
 * //   ^? 'name' | 'city'
 * type publicFields = 'name' | 'age'; // no relation with Person, so no error
 * type personPublicFields = SubsetKeysOf<Person, 'name' | 'age'> // error
 */
export type SubsetKeysOf<S, K extends keyof S> = K;

/**
 * Normalizes any complex type (union, overload, conditional, function-like)
 * into a guaranteed plain object type that can be safely spread in JSX:
 *
 *   `<Adapter {...adapterProps}/>`
 *
 * Required because many library props (e.g. MUI DataGridProps) include
 * intersections, function signatures, unions, etc., that TypeScript
 * does NOT treat as a spreadable object and causing error:
 * "Spread types may only be created from object types".
 */
export type SpreadableObject<O> = {
	[K in keyof O]: O[K];
};

export type StringKeyedObject<V = unknown> = Record<string, V>;

/**
 * Represents an object that cannot have any keys of type `K`.
 *
 * It uses a mapped type:
 *   `[Member in K]: never`
 * which means “for each key in K, the value must be never”, effectively
 * forbidding any properties whose key type matches K.
 *
 * For the generic parameter `K extends PropertyKey`:
 * - `extends PropertyKey` restricts K to valid JavaScript key types
 *   (`string`, `number`, `symbol`, or their union)
 * - `= PropertyKey` sets the default to all key types, meaning no keys
 *   of any kind are allowed.
 *
 * @example
 * const sym = Symbol();
 *
 * const ok: EmptyObject = {};                 // ✔ allowed
 * const err1: EmptyObject = { a: 1 };         // ❌ string key
 * const err2: EmptyObject = { 1: true };      // ❌ number key
 * const err3: EmptyObject = { [sym]: true };  // ❌ symbol key
 */
export type EmptyObject<K extends PropertyKey = PropertyKey> = {
	[Member in K]: never;
};

export type PlainObject = Record<PropertyKey, unknown>;
export function isPlainObject(arg: unknown): arg is PlainObject {
	if (
		arg !== null &&
		typeof arg === 'object' &&
		[null, Object.prototype].includes(Object.getPrototypeOf(arg))
	) {
		return true;
	}

	return false;
}

export function getObjectKeysReadOnly<T>(
	obj: StringKeyedObject<T>
): ReadonlyArray<string> {
	return Object.keys(obj);
}

export function countObjectKeys(obj: StringKeyedObject): number {
	return Object.keys(obj).length;
}

/**
 * Checks whether an object has **no own enumerable string keys**.
 *
 * - Uses `Object.keys()` internally, so it **ignores**:
 *   - Symbol keys
 *   - Inherited properties
 *   - Non-enumerable properties
 *
 * This makes it ideal for validating plain data objects,
 * such as those parsed from JSON, where only enumerable string keys exist.
 *
 * @param obj The object to check.
 * @returns `true` if the object has no enumerable keys, otherwise `false`.
 */
export function isEmptyObject(
	obj: StringKeyedObject
): obj is EmptyObject<string> {
	if (isPlainObject(obj)) {
		return countObjectKeys(obj) === 0;
	}

	throw TypeError('isEmptyObject expects only object values');
}

export function isConcreteObject(
	obj: StringKeyedObject
): obj is StringKeyedObject {
	if (isPlainObject(obj)) {
		return countObjectKeys(obj) > 0;
	}
	throw TypeError('isConcreteObject expects only object values');
}

/**
 * Returns an array of key/values of the own enumerable properties(includes symbols) of an object
 * @param obj Object that contains the properties and methods.
 */
export function ownEntries<V>(
	obj: Record<PropertyKey, V>
): [string | symbol, V][] {
	return Reflect.ownKeys(obj)
		.filter((k) => Object.prototype.propertyIsEnumerable.call(obj, k))
		.map((k) => [k, obj[k]]);
}
