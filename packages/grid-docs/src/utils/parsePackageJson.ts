import { isPlainObject, isString } from "@jsoc/utils";

export type Dependencies = Record<string, string>;

export type PackageJson = Partial<{
  name: string;
  version: string;
  dependencies: Dependencies;
  devDependencies: Dependencies;
  peerDependencies: Dependencies;
}>;

export function parsePackageJson(rawString: string): PackageJson | null {
  const parsed: unknown = JSON.parse(rawString);

  if (!isPlainObject(parsed)) return null;

  return {
    name: readStringField(parsed.name),
    version: readStringField(parsed.version),
    dependencies: readDependenciesField(parsed.dependencies),
    devDependencies: readDependenciesField(parsed.devDependencies),
    peerDependencies: readDependenciesField(parsed.peerDependencies),
  };
}

function readStringField(value: unknown): string | undefined {
  return isString(value) ? value : undefined;
}

function readDependenciesField(value: unknown): Dependencies | undefined {
  if (!isPlainObject(value)) return undefined;

  const dependencies: Dependencies = {};

  for (const [depName, depVersion] of Object.entries(value)) {
    if (isString(depVersion)) {
      dependencies[depName] = depVersion;
    }
  }

  return dependencies;
}
