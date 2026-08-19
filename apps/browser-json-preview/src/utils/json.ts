import { parse, type ParseError } from "jsonc-parser";

export function fileNameWithoutExtension(fileName: string) {
  return fileName.replace(/\.jsonc?$/i, "");
}

export function jsoncToJson(jsonc: string): string | undefined {
  const errors: ParseError[] = [];
  const json = parse(jsonc, errors) as unknown;

  if (errors.length > 0) return undefined;
  return JSON.stringify(json);
}

export function parseJsonFromText(text: string): string | undefined {
  try {
    JSON.parse(text);
    return text;
  } catch {
    return jsoncToJson(text);
  }
}

/**
 * Checks if a given content type represents a JSON MIME type.
 * Supports standard JSON (application/json, text/json), vendor/structured JSON variants (+json suffix),
 * legacy types (application/x-json, text/x-json), and content types with parameters (e.g. charset=utf-8).
 */
export function isJsonContentType(contentType: string): boolean {
  const mimeType = contentType.split(";")[0]?.trim().toLowerCase();
  if (!mimeType) return false;

  const JSON_MIME_TYPES = [
    "application/json",
    "text/json",
    "application/x-json",
    "text/x-json",
  ];

  return (
    JSON_MIME_TYPES.includes(mimeType) ||
    (mimeType.includes("/") && mimeType.endsWith("+json"))
  );
}
