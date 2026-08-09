import { uriToFileName } from "#ext/utils/uri.ts";
import type { JSONFile } from "#shared/types.ts";
import * as vscode from "vscode";

export type JSONDocument = vscode.TextDocument & {
  type: "json" | "jsonc";
};

export function isJsonDocument(
  document: vscode.TextDocument,
): document is JSONDocument {
  return document.languageId === "json" || document.languageId === "jsonc";
}

export function toJsonFile(document: JSONDocument): JSONFile {
  const fileName = uriToFileName(document.uri);
  const json = document.getText();

  return { fileName, json };
}
