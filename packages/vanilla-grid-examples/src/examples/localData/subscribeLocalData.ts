import {
  LOCAL_DATA_EXAMPLE_CHANNEL,
  type LocalBroadcastListener,
  subscribeBroadcastChannel,
} from "@jsoc/grid-examples-shared";

/**
 * Subscribes to messages on the broadcast channel named {@link LOCAL_DATA_EXAMPLE_CHANNEL}.
 * Invokes the listener immediately with the last stored value, then on each update.
 */
export function subscribeLocalData(listener: LocalBroadcastListener) {
  return subscribeBroadcastChannel(LOCAL_DATA_EXAMPLE_CHANNEL, listener);
}
