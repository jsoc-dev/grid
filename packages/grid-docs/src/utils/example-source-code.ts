export const CODE_LANGUAGE_BY_EXTENSION = {
  css: "css",
  html: "html",
  js: "javascript",
  json: "json",
  jsx: "jsx",
  ts: "typescript",
  tsx: "tsx",
  txt: "plaintext",
  vue: "vue",
} as const;

export type CodeLanguage = (typeof CODE_LANGUAGE_BY_EXTENSION)[FileExtension];
export type FileExtension = keyof typeof CODE_LANGUAGE_BY_EXTENSION;

export const FILE_EXTENSIONS = Object.keys(
  CODE_LANGUAGE_BY_EXTENSION,
) as ReadonlyArray<FileExtension>;

export const CODE_LANGUAGES = [
  ...new Set(Object.values(CODE_LANGUAGE_BY_EXTENSION)),
] as ReadonlyArray<CodeLanguage>;

export function isValidFileExtension(ext: string): ext is FileExtension {
  return FILE_EXTENSIONS.includes(ext as FileExtension);
}

export function getFileExtension(filePath: string): FileExtension | undefined {
  const ext = filePath.split(".").at(-1);

  return ext && isValidFileExtension(ext) ? ext : undefined;
}

export function getCodeLanguageByFilePath(filePath: string): CodeLanguage {
  const fileExt = getFileExtension(filePath);
  return getCodeLanguageByFileExtension(fileExt ?? "");
}

export function getCodeLanguageByFileExtension(
  ext: string,
  ignoreUnknown: boolean = true,
): CodeLanguage {
  if (isValidFileExtension(ext)) {
    return CODE_LANGUAGE_BY_EXTENSION[ext];
  }

  if (ignoreUnknown) {
    return "plaintext";
  }

  throw new Error(`Unknown file extension: ${ext}`);
}
