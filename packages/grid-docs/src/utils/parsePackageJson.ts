import { isPlainObject } from "@jsoc/utils";

export type Dependencies = Record<string, string>;

export type PackageJson = Partial<{
  name: string;
  dependencies: Dependencies;
  devDependencies: Dependencies;
  peerDependencies: Dependencies;
}>;

export function parsePackageJson(rawString: string): PackageJson | null {
  const parsed = JSON.parse(rawString) as unknown;

  if (isPlainObject(parsed)) {
    return parsed;
  }

  return null;
}
