import {
  getLocalDataChannelName,
  type LocalBroadcastListener,
  subscribeBroadcastChannel,
} from "@jsoc/grid-examples-core";

/**
 * Subscribes to messages on the broadcast channel.
 * Invokes the listener immediately with the last stored value, then on each update.
 */
export function subscribeLocalData(listener: LocalBroadcastListener) {
  return subscribeBroadcastChannel(getLocalDataChannelName(), listener);
}
