import { LOCAL_DATA_EXAMPLE_CHANNEL } from "#constants/example-constants.ts";
import {
  type LocalBroadcastMessage,
  newBroadcastChannel,
} from "#utils/local-broadcasting.ts";

export function getLocalJSON(): string | undefined {
  const channel = newBroadcastChannel(LOCAL_DATA_EXAMPLE_CHANNEL);
  const message = channel.getLastStoredMessage();
  channel.close();
  return typeof message === "string" ? message : undefined;
}

/**
 * Subscribes to messages on the local JSON broadcast channel (e.g. docs playground).
 * Invokes the listener immediately with the last stored value, then on each update.
 */
export function subscribeLocalJSON(
  listener: (json: string | undefined) => void,
): () => void {
  return subscribeBroadcastChannel(LOCAL_DATA_EXAMPLE_CHANNEL, listener);
}

export function subscribeBroadcastChannel(
  channelName: string,
  listener: (message: LocalBroadcastMessage) => void,
): () => void {
  const channel = newBroadcastChannel(channelName);

  const notifyFromStorage = () => {
    listener(channel.getLastStoredMessage());
  };

  notifyFromStorage();

  const handleMessage = (event: MessageEvent) => {
    const data = event.data as LocalBroadcastMessage;
    listener(typeof data === "string" ? data : undefined);
  };

  const handleStorage = (event: StorageEvent) => {
    if (event.key !== channelName) {
      return;
    }
    listener(event.newValue ?? undefined);
  };

  channel.addEventListener("message", handleMessage);

  if (typeof window !== "undefined") {
    window.addEventListener("storage", handleStorage);
  }

  return () => {
    channel.removeEventListener("message", handleMessage);
    if (typeof window !== "undefined") {
      window.removeEventListener("storage", handleStorage);
    }
    channel.close();
  };
}
