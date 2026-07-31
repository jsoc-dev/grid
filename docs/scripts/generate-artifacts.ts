import { readFileSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import {
  ARTIFACT_FILES,
  type SerializedApiExportArtifact,
  type PackageMetadata,
  type ExampleManifestsArtifact,
  type PackageMetadataArtifact,
  type SerializedApiExportsByKind,
} from "@/artifacts/artifacts-types.ts";
import {
  EXAMPLE_SOURCE_MANIFEST_FILE_NAME,
  type ExampleSourceManifest,
  getAdapterIds,
  getExamplesRelativePath,
  getPluginIds,
  parsePackageJson,
} from "@jsoc/grid-docs";
import {
  API_PACKAGES,
  type AdapterPackageName,
  type PluginPackageName,
  resolvePackageFilePath,
  resolvePackageName,
} from "@/utils/api/api-packages.ts";
import { DeclarationKind } from "@/utils/api/api-declaration.ts";
import {
  getApiExports,
  groupApiExportsByDeclarationKind,
} from "@/utils/api/api-exports.ts";

const DOCS_DIR = process.cwd();
const ARTIFACT_GENERATED_DIR = path.join(
  DOCS_DIR,
  "src",
  "artifacts",
  "generated",
);

async function main() {
  await mkdir(ARTIFACT_GENERATED_DIR, { recursive: true });

  await Promise.all([
    writePackageMetadata(),
    writeExampleManifests(),
    writeApiExports(),
  ]);

  console.log("Generated docs artifacts in docs/src/artifacts/generated/");
}

async function writePackageMetadata() {
  const artifact = {} as PackageMetadataArtifact;

  for (const adapterId of getAdapterIds()) {
    artifact[adapterId] = readPackageMetadata(adapterId);

    for (const pluginId of getPluginIds(adapterId)) {
      const packageName = resolvePackageName(adapterId, pluginId);
      artifact[packageName] = readPackageMetadata(packageName);
    }
  }

  await writeGeneratedJson(ARTIFACT_FILES.packageMetadata, artifact);
}

function readPackageMetadata(
  packageName: AdapterPackageName | PluginPackageName,
): PackageMetadata {
  const packageJsonPath = resolvePackageFilePath(packageName, "package.json");
  const packageJson = parsePackageJson(readFileSync(packageJsonPath, "utf8"));

  if (!packageJson || !packageJson.name)
    throw new Error(`Invalid package.json at ${packageJsonPath}`);

  return {
    name: packageJson.name,
    version: packageJson.version ?? "",
    dependencies: packageJson.dependencies ?? {},
    devDependencies: packageJson.devDependencies ?? {},
    peerDependencies: packageJson.peerDependencies ?? {},
  };
}

async function writeExampleManifests() {
  const artifact = {} as ExampleManifestsArtifact;

  for (const adapterId of getAdapterIds()) {
    for (const pluginId of getPluginIds(adapterId)) {
      const packageName = resolvePackageName(adapterId, pluginId);
      const manifestPath = path.join(
        DOCS_DIR,
        "public",
        getExamplesRelativePath(adapterId, pluginId),
        EXAMPLE_SOURCE_MANIFEST_FILE_NAME,
      );

      const manifestText = await readFile(manifestPath, "utf8");
      artifact[packageName] = JSON.parse(manifestText) as ExampleSourceManifest;
    }
  }

  await writeGeneratedJson(ARTIFACT_FILES.exampleManifests, artifact);
}

async function writeApiExports() {
  const artifact = Object.fromEntries(
    API_PACKAGES.map((packageName) => [
      packageName,
      serializeApiExportsByKind(packageName),
    ]),
  ) as SerializedApiExportArtifact;

  await writeGeneratedJson(ARTIFACT_FILES.apiExports, artifact);
}

function serializeApiExportsByKind(
  packageName: (typeof API_PACKAGES)[number],
): SerializedApiExportsByKind {
  const grouped = groupApiExportsByDeclarationKind(getApiExports(packageName));

  return Object.fromEntries(
    Object.entries(grouped)
      .filter(
        (
          entry,
        ): entry is [DeclarationKind, (typeof grouped)[DeclarationKind]] => {
          const [, exports] = entry;
          return exports.length > 0;
        },
      )
      .map(([kind, exports]) => [
        kind,
        exports.map(({ name, packageName }) => ({ name, packageName })),
      ]),
  ) as SerializedApiExportsByKind;
}

async function writeGeneratedJson(fileName: string, value: unknown) {
  const contents = JSON.stringify(value, null, 2) + "\n";
  await writeFile(
    path.join(ARTIFACT_GENERATED_DIR, fileName),
    contents,
    "utf8",
  );
}

main().catch((error: unknown) => {
  console.error("Failed to generate docs artifacts.", error);
  process.exit(1);
});
