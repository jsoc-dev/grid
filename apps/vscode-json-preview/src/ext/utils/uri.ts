import { DEFAULT_FILE_NAME } from "#ext/constants.ts";
import * as vscode from "vscode";

/**
 * A helper function which will get the webview URI of a given file or resource.
 *
 * @see https://github.com/microsoft/vscode-webview-ui-toolkit-samples/blob/main/default/hello-world/src/utilities/getUri.ts
 * @remarks This URI can be used within a webview's HTML as a link to the
 * given file/resource.
 *
 * @param webview A reference to the extension webview
 * @param extensionUri The URI of the directory containing the extension
 * @param pathList An array of strings representing the path to a file/resource
 * @returns A URI pointing to the file/resource
 */
export function getUri(
  webview: vscode.Webview,
  extensionUri: vscode.Uri,
  pathList: string[],
) {
  return webview.asWebviewUri(vscode.Uri.joinPath(extensionUri, ...pathList));
}

export function uriToFileName(uri: vscode.Uri, useDefault?: true): string;
export function uriToFileName(
  uri: vscode.Uri,
  useDefault: false,
): string | undefined;
export function uriToFileName(uri: vscode.Uri, useDefault: boolean = true) {
  const fileName = uri.path.split("/").pop();
  return fileName ?? (useDefault ? DEFAULT_FILE_NAME : undefined);
}

export function isEqualUri(uri1: vscode.Uri, uri2: vscode.Uri): boolean {
  return uri1.toString() === uri2.toString();
}
