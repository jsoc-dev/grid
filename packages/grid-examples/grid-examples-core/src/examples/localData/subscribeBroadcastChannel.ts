import {
  PersistentBroadcastChannel,
  type PersistentBroadcastMessage,
} from "#examples/localData/PersistentBroadcastChannel.ts";

export type LocalBroadcastListener = (
  message: PersistentBroadcastMessage,
) => void;

/**
 * Subscribes to messages on the given broadcast channel.
 * Invokes the listener immediately with the last stored value, then on each update.
 */
export function subscribeBroadcastChannel(
  channelName: string,
  listener: LocalBroadcastListener,
): () => void {
  const channel = new PersistentBroadcastChannel(channelName);

  listener(channel.getLastMessage());

  const handleMessage = (event: MessageEvent<PersistentBroadcastMessage>) => {
    listener(event.data);
  };

  channel.addEventListener("message", handleMessage);

  return () => {
    channel.removeEventListener("message", handleMessage);
    channel.close();
  };
}
