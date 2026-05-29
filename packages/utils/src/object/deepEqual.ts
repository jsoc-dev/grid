import { isPlainObject } from "#object/object.ts";

export type DeepEqualKeyPath = ReadonlyArray<string>;
export type DeepEqualComparisonKeys = ReadonlyArray<DeepEqualKeyPath>;
type NestedPathTreeNode = {
  terminal: boolean;
  children: Map<string, NestedPathTreeNode>;
};

/**
 * Deep-compares two objects by following exact configured key paths.
 *
 * Semantics:
 * - Recursion only happens when both compared values are plain objects.
 * - Arrays and other non-plain objects are compared by reference with Object.is.
 * - Each configured path is an exact shallow boundary:
 *   - at the path end, exactly one shallow plain-object comparison is performed
 *   - outside configured paths, values are compared with Object.is
 * - Overlapping/prefix paths are invalid and throw during path-tree construction.
 *
 * @example
 * const prev = { filters: { status: "active" }, page: 1 };
 * const next = { filters: { status: "active" }, page: 1 };
 * // Recurse into `filters` and stop there with one shallow object compare.
 * // true, because `filters` is shallow-compared at the path end.
 * deepEqual(prev, next, [["filters"]]);
 *
 * @example
 * // Recurse through an exact deep path.
 * const prev = { filters: { a: { filters: { mode: "x" } } } };
 * const next = { filters: { a: { filters: { mode: "x" } } } };
 * // true, because comparison follows `filters -> a -> filters`.
 * deepEqual(prev, next, [["filters", "a", "filters"]]);
 *
 * @example
 * // Compare multiple paths.
 * const prev = {
 *   filters: { status: "active" },
 *   sort: { meta: { order: "asc" } },
 * };
 * const next = {
 *   filters: { status: "active" },
 *   sort: { meta: { order: "asc" } },
 * };
 * // true, because both configured paths match.
 * deepEqual(prev, next, [
 *   ["filters"],
 *   ["sort", "meta"],
 * ]);
 */
export function deepEqual(
  a: unknown,
  b: unknown,
  keys: DeepEqualComparisonKeys,
): boolean {
  const nestedPathTree = buildNestedPathTree(keys);
  const visited = new WeakMap<object, WeakSet<object>>();

  const hasSeenPair = (left: object, right: object) => {
    return visited.get(left)?.has(right) ?? false;
  };

  const markPairAsSeen = (left: object, right: object) => {
    let seenRights = visited.get(left);
    if (!seenRights) {
      seenRights = new WeakSet<object>();
      visited.set(left, seenRights);
    }
    seenRights.add(right);
  };

  const compareShallowObject = (left: unknown, right: unknown): boolean => {
    if (!isPlainObject(left) || !isPlainObject(right)) {
      return Object.is(left, right);
    }

    const keysA = Object.keys(left);
    const keysB = Object.keys(right);
    if (keysA.length !== keysB.length) {
      return false;
    }

    return keysA.every((key) => {
      return Object.hasOwn(right, key) && Object.is(left[key], right[key]);
    });
  };

  const compare = (
    left: unknown,
    right: unknown,
    node: NestedPathTreeNode,
  ): boolean => {
    if (!isPlainObject(left) || !isPlainObject(right)) {
      return Object.is(left, right);
    }

    if (hasSeenPair(left, right)) {
      return true;
    }

    markPairAsSeen(left, right);

    const keysA = Object.keys(left);
    const keysB = Object.keys(right);
    if (keysA.length !== keysB.length) {
      return false;
    }

    return keysA.every((key) => {
      if (!Object.hasOwn(right, key)) {
        return false;
      }

      const childPathNode = node.children.get(key);
      if (!childPathNode) {
        return Object.is(left[key], right[key]);
      }

      // Path ended at this node: perform exactly one shallow compare.
      if (childPathNode.terminal) {
        return compareShallowObject(left[key], right[key]);
      }

      return compare(left[key], right[key], childPathNode);
    });
  };

  return compare(a, b, nestedPathTree);
}

function buildNestedPathTree(
  keys: DeepEqualComparisonKeys,
): NestedPathTreeNode {
  const root: NestedPathTreeNode = {
    terminal: false,
    children: new Map(),
  };
  for (const path of keys) {
    if (path.length === 0) {
      continue;
    }

    let node = root;
    for (const [index, segment] of path.entries()) {
      if (node.terminal) {
        throw new Error(
          `Conflicting deepEqual key paths: "${formatKeyPath(path.slice(0, index))}" is a prefix of "${formatKeyPath(path)}".`,
        );
      }

      let child = node.children.get(segment);
      if (!child) {
        child = {
          terminal: false,
          children: new Map(),
        };
        node.children.set(segment, child);
      }
      node = child;
    }

    if (node.children.size > 0) {
      throw new Error(
        `Conflicting deepEqual key paths: "${formatKeyPath(path)}" is a prefix of another configured path.`,
      );
    }

    node.terminal = true;
  }

  return root;
}

function formatKeyPath(path: ReadonlyArray<string>): string {
  return path.join(".");
}
