import { isString } from "@jsoc/utils";

export type LocalBroadcastMessage = string | undefined;

export interface LocalBroadcastChannel extends BroadcastChannel {
  closed: boolean;
  storeAndPostMessage: (message: LocalBroadcastMessage) => void;
  getLastStoredMessage: () => LocalBroadcastMessage;
}

export function newBroadcastChannel(
  channelName: string,
): LocalBroadcastChannel {
  const channel = new BroadcastChannel(channelName);
  const originalClose = channel.close;

  Object.assign(channel, {
    closed: false,
    storeAndPostMessage: (message: LocalBroadcastMessage) => {
      if (isString(message)) {
        localStorage.setItem(channel.name, message);
      } else {
        localStorage.removeItem(channel.name);
      }
      channel.postMessage(message);
    },
    getLastStoredMessage: () => {
      return localStorage.getItem(channel.name) ?? undefined;
    },
    close: () => {
      (channel as LocalBroadcastChannel).closed = true;
      originalClose.call(channel);
    },
  });

  return channel as LocalBroadcastChannel;
}
