import {
  getAdapterIds,
  getAdapterMetadata,
  getPluginIds,
  getPluginMetadata,
  isValidAdapterId,
  isValidPluginId,
  type AdapterId,
  type PluginId,
} from "@jsoc/grid-docs";
import path from "path";

export type CorePackageName = "grid-core";
export type AdapterPackageName = AdapterId;
export type PluginPackageByAdapterId<A extends AdapterId> = A extends AdapterId
  ? `${A}-${PluginId<A>}`
  : never;

export type PluginPackageName = PluginPackageByAdapterId<AdapterId>;

export type ApiPackageName =
  | CorePackageName
  | AdapterPackageName
  | PluginPackageName;

export type PackageNameParts<A extends AdapterId = AdapterId> = {
  adapterId: A | undefined;
  pluginId: PluginId<A> | undefined;
};

const CORE_PACKAGE_NAME: CorePackageName = "grid-core";
const ADAPTER_PACKAGE_NAMES = getAdapterIds();
const PLUGIN_PACKAGE_NAMES: PluginPackageName[] = ADAPTER_PACKAGE_NAMES.flatMap(
  (adapterId) =>
    getPluginIds(adapterId).map(
      (pluginId) => `${adapterId}-${pluginId}` as PluginPackageName,
    ),
);

export const API_PACKAGES = [
  CORE_PACKAGE_NAME,
  ...ADAPTER_PACKAGE_NAMES,
  ...PLUGIN_PACKAGE_NAMES,
];

export const GROUPED_API_PACKAGE_NAMES = {
  corePackage: CORE_PACKAGE_NAME,
  adapterPackages: ADAPTER_PACKAGE_NAMES,
  pluginPackages: PLUGIN_PACKAGE_NAMES,
};

export function extractPackageNameParts(
  packageName: ApiPackageName,
): PackageNameParts {
  const parts = packageName.split("-");
  const adapterId = parts.slice(0, 2).join("-");

  if (!isValidAdapterId(adapterId))
    return { adapterId: undefined, pluginId: undefined };

  const pluginId = packageName.replace(`${adapterId}-`, "");

  if (!isValidPluginId(adapterId, pluginId))
    return { adapterId, pluginId: undefined };

  return { adapterId, pluginId };
}

export function getPackageDisplayName(packageName: ApiPackageName): string {
  if (isCorePackageName(packageName)) return "Grid Core";

  if (isAdapterPackageName(packageName))
    return getAdapterMetadata(packageName).name;

  const { adapterId, pluginId } = extractPackageNameParts(packageName);

  if (adapterId && pluginId) return getPluginMetadata(adapterId, pluginId).name;

  return packageName;
}

export function isCorePackageName(
  packageName: ApiPackageName,
): packageName is CorePackageName {
  return packageName === CORE_PACKAGE_NAME;
}

export function isAdapterPackageName(
  packageName: ApiPackageName,
): packageName is AdapterPackageName {
  return isValidAdapterId(packageName);
}

export function isPluginPackageName(
  packageName: ApiPackageName,
): packageName is PluginPackageName {
  return !!extractPackageNameParts(packageName).pluginId;
}

export function isValidPluginPackageForAdapter<A extends AdapterId>(
  pluginPackageName: PluginPackageName,
  adapterId: A,
): pluginPackageName is PluginPackageByAdapterId<A> {
  const { adapterId: extractedAdapterId } =
    extractPackageNameParts(pluginPackageName);

  return extractedAdapterId === adapterId;
}

export function isValidApiPackageName(name: string): name is ApiPackageName {
  return API_PACKAGES.includes(name as ApiPackageName);
}

export function resolvePackageDirectoryPath(packageName: ApiPackageName) {
  const { adapterId, pluginId } = extractPackageNameParts(packageName);

  const relativePath =
    adapterId && pluginId ? `${adapterId}-plugins/${packageName}` : packageName;

  return path.resolve(process.cwd(), `../packages/${relativePath}`);
}

export function resolvePackageFilePath(
  packageName: ApiPackageName,
  filePath: string,
) {
  const packageDir = resolvePackageDirectoryPath(packageName);
  return path.join(packageDir, filePath);
}

const PACKAGE_SCOPE = "@jsoc";

export function withPackageScope(packageName: ApiPackageName): string {
  return `${PACKAGE_SCOPE}/${packageName}`;
}

export function withPackageLink(packageName: ApiPackageName) {
  return `https://www.npmjs.com/package/${withPackageScope(packageName)}`;
}
