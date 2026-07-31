import type { SerializedApiExportsByKind } from "@/artifacts/artifacts-types";
import type { ApiPackageName } from "@/utils/api/api-packages";
import API_EXPORTS from "@/artifacts/generated/api-exports.json";

export function getSerializedApiExports(
  packageName: ApiPackageName,
): SerializedApiExportsByKind {
  const apiExports = API_EXPORTS[packageName];

  if (!apiExports) {
    throw new Error(
      `API exports not found for "${packageName}". Run "pnpm generate-artifacts".`,
    );
  }

  return apiExports;
}
