/**
 * A helper function that returns a unique alphanumeric identifier called a nonce.
 *
 * @see https://github.com/microsoft/vscode-webview-ui-toolkit-samples/blob/main/default/hello-world/src/utilities/getNonce.ts
 * @remarks This function is primarily used to help enforce content security
 * policies for resources/scripts being executed in a webview context.
 *
 * @returns A nonce
 */
export function getNonce() {
  let text = "";
  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < 32; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}
