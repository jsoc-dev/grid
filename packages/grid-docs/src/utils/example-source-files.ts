import type { ExampleId } from "#metadata/examples-metadata.ts";
import type {
  ExampleSourceFile,
  LanguagePreference,
} from "#types/example-source-files.ts";
import type { AdapterId, PluginId } from "#types/plugins.ts";
import type { ExampleSourceManifest } from "#utils/build-examples.ts";
import { getCodeLanguageByFilePath } from "#utils/example-source-code.ts";

import { equalsIgnoreCase } from "@jsoc/utils";

export function extractSourceFilesFromManifest(
  manifest: ExampleSourceManifest,
): ExampleSourceFile[] {
  return Object.entries(manifest).map(([filePath, code]) => ({
    path: filePath,
    code,
    name: filePath.split("/").pop()!,
    language: getCodeLanguageByFilePath(filePath),
  }));
}

export function isExampleFile(file: ExampleSourceFile) {
  return file.path.startsWith("src/examples/");
}

export function isSharedFile(file: ExampleSourceFile) {
  return !isExampleFile(file);
}

/**
 * Checks if a file belongs to a specific example by looking for the `exampleId` in its path.
 *
 * Returns `true` if the file is a valid example file (via {@link isExampleFile}) AND
 * at least one segment of its path (ignoring file extensions) matches the `exampleId`
 * case-insensitively.
 *
 * @example
 * If given `exampleId` is `"Basic"`:
 * - `src/examples/basic.ts` → true
 * - `src/examples/basic/index.ts` → true
 * - `src/examples/basic/Basic.ts` → true
 * - `src/examples/localData.ts` → false
 * - `src/examples/localData/index.ts` → false
 */
export function isSpecificExampleFile(
  file: ExampleSourceFile,
  exampleId: string,
): boolean {
  if (!isExampleFile(file)) return false;

  const segments = file.path.split("/");

  return segments.some((seg) => {
    const base = seg.includes(".") ? seg.slice(0, seg.lastIndexOf(".")) : seg;
    return equalsIgnoreCase(base, exampleId);
  });
}

/**
 * Checks if the given file is relevant to the example ID.
 */
export function isRelevantFile<A extends AdapterId, P extends PluginId<A>>(
  file: ExampleSourceFile,
  exampleId: ExampleId<A, P>,
) {
  if (isSharedFile(file)) return true;

  return isSpecificExampleFile(file, exampleId);
}

/**
 * Returns only the files relevant to the given example ID.
 */
export function filterFilesForExample<
  A extends AdapterId,
  P extends PluginId<A>,
>(files: ExampleSourceFile[], exampleId: ExampleId<A, P>): ExampleSourceFile[] {
  return files.filter((file) => isRelevantFile(file, exampleId));
}

export function findFileByLanguagePreference(
  files: ExampleSourceFile[],
  file: ExampleSourceFile,
  languagePreference: LanguagePreference,
): ExampleSourceFile | undefined {
  if (file.language === languagePreference) return file;

  let targetPath = file.path;
  if (languagePreference === "javascript") {
    targetPath = targetPath.replace(/\.tsx?$/, (ext) =>
      ext === ".tsx" ? ".jsx" : ".js",
    );
  } else {
    targetPath = targetPath.replace(/\.jsx?$/, (ext) =>
      ext === ".jsx" ? ".tsx" : ".ts",
    );
  }

  return files.find((f) => f.path === targetPath);
}

export function findSuitableDefaultFile<
  A extends AdapterId,
  P extends PluginId<A>,
>(
  files: ExampleSourceFile[],
  exampleId: ExampleId<A, P>,
  languagePreference: LanguagePreference,
) {
  const exampleFiles = files.filter((f) => isSpecificExampleFile(f, exampleId));

  const file = exampleFiles.find((f) => {
    if (languagePreference === "typescript") {
      return f.language === "typescript" || f.language === "tsx";
    }
    if (languagePreference === "javascript") {
      return f.language === "javascript" || f.language === "jsx";
    }
    return f.language === languagePreference;
  });
  if (file) return file;
  return exampleFiles[0] ?? files[0];
}
