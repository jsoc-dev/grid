import {
  useBroadcast,
  useGetBroadcastMessage,
} from "#examples/localData/useBroadcast.ts";

import {
  LOCAL_DATA_EXAMPLE_CHANNEL,
  type PersistentBroadcastMessage,
} from "@jsoc/grid-examples-core";

/**
 * Returns the data broadcasted in the local broadcast channel named {@link LOCAL_DATA_EXAMPLE_CHANNEL}.
 * Returns undefined if no data has been broadcasted yet or explicitly broadcasted undefined.
 */
export function useGetLocalData(): PersistentBroadcastMessage {
  return useGetBroadcastMessage(LOCAL_DATA_EXAMPLE_CHANNEL);
}

/**
 * Broadcasts the given data to the local broadcast channel named {@link LOCAL_DATA_EXAMPLE_CHANNEL}.
 */
export function useSetLocalData(data: PersistentBroadcastMessage) {
  useBroadcast(LOCAL_DATA_EXAMPLE_CHANNEL, data);
}
