import {
  resolveDeclarationKind,
  DeclarationKind,
} from "@/utils/api/api-declaration";
import {
  resolvePackageFilePath,
  type ApiPackageName,
} from "@/utils/api/api-packages";
import type {
  ApiExport,
  ExportedDeclarationsWithKind,
  ResolvedApiExport,
} from "@/utils/api/api-reference-types";
import { isDefined } from "@jsoc/utils";
import path from "node:path";
import { Project, type ExportedDeclarations } from "ts-morph";

/**
 * Singleton ts-morph `Project` shared across all `getApiExports()` calls.
 *
 * `new Project()` is expensive — it bootstraps a full TypeScript compiler
 * instance (ts.Program, CompilerHost, language service, type checker) and sets
 * up an in-memory virtual file system with lib.d.ts / module resolution.
 *
 * By creating it once at module level, we ensure:
 * - The compiler initializes **once** instead of N times (one per package).
 * - Source files parsed for one package are already cached for the next.
 * - The type checker reuses its internal caches across packages.
 */
const project = new Project({
  skipAddingFilesFromTsConfig: true,
  compilerOptions: { strictNullChecks: true },
});

// Simple memory cache so we don't re-parse across multiple Next.js static generations
const apiExportsCache: Partial<Record<ApiPackageName, ApiExport[]>> = {};

export function getApiExports(packageName: ApiPackageName): ApiExport[] {
  if (apiExportsCache[packageName]) return apiExportsCache[packageName];

  const indexPath = resolvePackageFilePath(packageName, "src/index.ts");
  const sourceFile =
    project.getSourceFile(indexPath) || project.addSourceFileAtPath(indexPath);

  const exportedDeclarations = sourceFile.getExportedDeclarations();
  const apiExports: ApiExport[] = [];

  for (const [name, declarations] of exportedDeclarations) {
    // we assert `ExportedDeclarations | undefined` as ts-morth detects the exports but can't parse declarations in .vue files
    const declaration = declarations.find(isDefined) as
      | ExportedDeclarations
      | undefined;
    const kind = resolveDeclarationKind(name, packageName, declaration);
    const declarationWithKind = Object.assign(declaration ?? {}, { kind });

    apiExports.push({
      name,
      declaration: declarationWithKind as ExportedDeclarationsWithKind,
      packageName,
    });
  }

  // Sort exports alphabetically to keep the sidebar predictable
  apiExports.sort((a, b) => a.name.localeCompare(b.name));

  return (apiExportsCache[packageName] = apiExports);
}

export type ApiExportsGroup = Record<DeclarationKind, ApiExport[]>;

export function groupApiExportsByDeclarationKind(
  input: ApiPackageName | ApiExport[],
): ApiExportsGroup {
  const allExports = Array.isArray(input) ? input : getApiExports(input);

  const map = Object.values(DeclarationKind).reduce((acc, kind) => {
    acc[kind] = [];
    return acc;
  }, {} as ApiExportsGroup);

  for (const apiExport of allExports) {
    map[apiExport.declaration.kind].push(apiExport);
  }

  return map;
}

export function getModuleSpecifierRelativeToDocs(
  declaration: ExportedDeclarations,
) {
  const declarationSourceFilePath = declaration.getSourceFile().getFilePath();

  const exportedModuleSpecifier = path
    .relative(process.cwd(), declarationSourceFilePath) // returns path relative to `docs`, example: "..\packages\grid-core\src\index.ts"
    .replace(/\\/g, "/"); // module specifiers must use forward slash

  return exportedModuleSpecifier;
}

export function getModuleSpecifierRelativeToRoot(
  declaration: ExportedDeclarations,
) {
  return getModuleSpecifierRelativeToDocs(declaration).replace(/^\.\.\//, ""); // removes leading "..", example: "../packages/xyz" => "packages/xyz" (makes it relative to repo's root instead of `docs`)
}

export function isResolvedApiExport(
  apiExport: ApiExport,
): apiExport is ResolvedApiExport {
  return apiExport.declaration.kind !== DeclarationKind.Unresolved;
}
