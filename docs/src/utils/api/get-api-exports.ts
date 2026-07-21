import type {
  ApiExport,
  ApiPackageName,
} from "@/utils/api/api-reference-types";
import path from "node:path";
import { Project } from "ts-morph";

// Simple memory cache so we don't re-parse across multiple Next.js static generations
const apiExportsCache: Partial<Record<ApiPackageName, ApiExport[]>> = {};

export function getApiExports(
  packageName: ApiPackageName = "grid-core",
): ApiExport[] {
  if (apiExportsCache[packageName]) return apiExportsCache[packageName];

  const project = new Project({
    tsConfigFilePath: resolveFilePath(packageName, "tsconfig.json"),
  });

  const sourceFile = project.getSourceFileOrThrow(
    resolveFilePath(packageName, "src/index.ts"),
  );

  const exportedDeclarations = sourceFile.getExportedDeclarations();
  const apiExports: ApiExport[] = [];

  for (const [name, declarations] of exportedDeclarations) {
    const declaration = declarations[0];
    apiExports.push({ name, declaration });
  }

  // Sort exports alphabetically to keep the sidebar predictable
  apiExports.sort((a, b) => a.name.localeCompare(b.name));

  return (apiExportsCache[packageName] = apiExports);
}

function resolveFilePath(packageName: ApiPackageName, fileName: string) {
  return path.resolve(process.cwd(), `../packages/${packageName}/${fileName}`);
}
