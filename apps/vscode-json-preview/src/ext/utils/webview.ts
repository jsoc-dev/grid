import { EXTENSION_DISPLAY_NAME } from "#ext/constants.ts";
import { getNonce } from "#ext/utils/nonce.ts";
import { getUri } from "#ext/utils/uri.ts";
import { INITIAL_JSON_FILE_GLOBAL } from "#shared/constants.ts";
import type { JSONFile } from "#shared/types.ts";
import webviewHtml from "#ui/webview.html";
import * as vscode from "vscode";

export function getWebviewHtml(
  webview: vscode.Webview,
  extensionUri: vscode.Uri,
  file: JSONFile,
) {
  let html = webviewHtml;

  const templateVars = getTemplateVars(webview, extensionUri, file);
  for (const [key, value] of Object.entries(templateVars)) {
    html = html.replaceAll(`{{${key}}}`, value);
  }

  return html;
}

function getTemplateVars(
  webview: vscode.Webview,
  extensionUri: vscode.Uri,
  file: JSONFile,
) {
  const nonce = getNonce();

  return {
    cspSource: webview.cspSource,
    initialJsonFileScript: `window.${INITIAL_JSON_FILE_GLOBAL}=${serializeJsonFileForScript(file)};`,
    nonce,
    styleUri: getUri(webview, extensionUri, ["dist", "webview.css"]).toString(),
    scriptUri: getUri(webview, extensionUri, ["dist", "webview.js"]).toString(),
    title: EXTENSION_DISPLAY_NAME,
  };
}

function serializeJsonFileForScript(file: JSONFile) {
  return JSON.stringify(file).replaceAll("<", "\\u003c");
}
