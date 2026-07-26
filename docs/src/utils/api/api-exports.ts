import {
  resolvePackageFilePath,
  type ApiPackageName,
} from "@/utils/api/api-packages";
import type { ApiExport } from "@/utils/api/api-reference-types";
import { isDefined, type ExactlyOneTrue } from "@jsoc/utils";
import path from "node:path";
import { Node, Project, type ExportedDeclarations } from "ts-morph";

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

    apiExports.push({ name, declaration, packageName });
  }

  // Sort exports alphabetically to keep the sidebar predictable
  apiExports.sort((a, b) => a.name.localeCompare(b.name));

  return (apiExportsCache[packageName] = apiExports);
}

type ApiExportsGroup =
  | "allExports"
  | "classExports"
  | "functionExports"
  | "typeExports"
  | "otherExports";

export function getGroupedApiExports(packageName: ApiPackageName): {
  [K in ApiExportsGroup]: ApiExport[];
} {
  const allExports = getApiExports(packageName);

  const map: Record<ApiExportsGroup, ApiExport[]> = {
    allExports,
    classExports: [],
    functionExports: [],
    typeExports: [],
    otherExports: [],
  };

  for (const apiExport of allExports) {
    const { declaration } = apiExport;
    const { isClass, isFunction, isType, isOther } =
      checkDeclarationKind(declaration);

    if (isClass) {
      map.classExports.push(apiExport);
    } else if (isFunction) {
      map.functionExports.push(apiExport);
    } else if (isType) {
      map.typeExports.push(apiExport);
    } else if (isOther) {
      map.otherExports.push(apiExport);
    }
  }

  return map;
}

export type CheckDeclarationKindResult = ExactlyOneTrue<
  "isClass" | "isFunction" | "isType" | "isOther"
>;

const baseCheckDeclarationKindResult = {
  isClass: false,
  isFunction: false,
  isType: false,
  isOther: false,
} as const;

export function checkDeclarationKind(
  declaration: ExportedDeclarations | undefined,
): CheckDeclarationKindResult {
  if (Node.isClassDeclaration(declaration)) {
    return { ...baseCheckDeclarationKindResult, isClass: true };
  } else if (Node.isFunctionDeclaration(declaration)) {
    return { ...baseCheckDeclarationKindResult, isFunction: true };
  } else if (
    Node.isTypeAliasDeclaration(declaration) ||
    Node.isInterfaceDeclaration(declaration)
  ) {
    return { ...baseCheckDeclarationKindResult, isType: true };
  }
  return { ...baseCheckDeclarationKindResult, isOther: true };
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
