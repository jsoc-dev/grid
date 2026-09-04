import {
  useBroadcast,
  useGetBroadcastMessage,
} from "#examples/localData/useBroadcast.ts";

import {
  getLocalDataChannelName,
  type PersistentBroadcastMessage,
} from "@jsoc/grid-examples-core";

/**
 * Returns the data broadcasted to the local broadcast channel.
 * Returns undefined if no data has been broadcasted yet or explicitly broadcasted undefined.
 */
export function useGetLocalData(): PersistentBroadcastMessage {
  return useGetBroadcastMessage(getLocalDataChannelName());
}

/**
 * Broadcasts the given data to the local broadcast channel.
 */
export function useSetLocalData(
  data: PersistentBroadcastMessage,
  channelName?: string,
) {
  useBroadcast(channelName ?? getLocalDataChannelName(), data);
}
