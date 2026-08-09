import { INITIAL_JSON_FILE_GLOBAL } from "#shared/constants.ts";
import type { JSONFile } from "#shared/types.ts";

declare global {
  interface Window {
    [INITIAL_JSON_FILE_GLOBAL]: JSONFile;
  }
}

export function getInitialJsonFile(): JSONFile {
  return window[INITIAL_JSON_FILE_GLOBAL];
}

export function fileNameWithoutExtension(fileName: string) {
  return fileName.replace(/\.jsonc?$/i, "");
}

/** Strip line and block comments without touching string contents. */
export function removeComments(json: string) {
  let result = "";
  let i = 0;

  while (i < json.length) {
    const char = json[i];
    const next = json[i + 1];

    if (char === '"') {
      result += char;
      i++;
      while (i < json.length) {
        const c = json[i];
        result += c;
        if (c === "\\") {
          i++;
          if (i < json.length) result += json[i];
        } else if (c === '"') {
          break;
        }
        i++;
      }
      i++;
      continue;
    }

    if (char === "/" && next === "/") {
      i += 2;
      while (i < json.length && json[i] !== "\n") i++;
      continue;
    }

    if (char === "/" && next === "*") {
      i += 2;
      while (i < json.length - 1 && !(json[i] === "*" && json[i + 1] === "/")) {
        i++;
      }
      i += 2;
      continue;
    }

    result += char;
    i++;
  }

  return result;
}

export function removeTrailingCommas(json: string) {
  return json.replace(/,(\s*[}\]])/g, "$1");
}
