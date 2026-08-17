export enum WebviewMessageType {
  Event = "event",
}

export enum WebviewEvent {
  DoubleClick = "doubleClick",
}

export type WebviewEventMessage = {
  type: WebviewMessageType.Event;
  event: WebviewEvent.DoubleClick;
};

/** Message sent from the webview to the extension host. */
export type WebviewMessage = WebviewEventMessage;
