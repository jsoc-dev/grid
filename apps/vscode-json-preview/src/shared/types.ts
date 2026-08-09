export type JSONFile = {
  fileName: string;
  json: string;
};

export type HostUpdateMessage = {
  type: "update";
  file: JSONFile;
};

/** Message sent from the extension host to the webview. */
export type HostMessage = HostUpdateMessage;
