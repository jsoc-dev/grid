export type ApiPackageName = keyof typeof API_PACKAGE_MAP;

export const API_PACKAGE_MAP = {
  "grid-core": "Core",
  "react-grid": "React Adapter",
  "vanilla-grid": "Vanilla Adapter",
  "vue-grid": "Vue Adapter",
} as const;

export const API_PACKAGES = Object.keys(API_PACKAGE_MAP) as ApiPackageName[];

export function isValidApiPackageName(name: string): name is ApiPackageName {
  return API_PACKAGES.includes(name as ApiPackageName);
}

export function getPackageDisplayName(packageName: ApiPackageName): string {
  return API_PACKAGE_MAP[packageName];
}

export function withPackageScope(packageName: ApiPackageName): string {
  return `@jsoc/${packageName}`;
}
