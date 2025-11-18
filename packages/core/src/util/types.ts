
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


