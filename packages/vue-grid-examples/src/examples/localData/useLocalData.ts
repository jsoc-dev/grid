import {
  useBroadcast,
  useGetBroadcastMessage,
} from "#examples/localData/useBroadcast.ts";

import {
  LOCAL_DATA_EXAMPLE_CHANNEL,
  type PersistentBroadcastMessage,
} from "@jsoc/grid-examples-shared";

export function useGetLocalData() {
  return useGetBroadcastMessage(LOCAL_DATA_EXAMPLE_CHANNEL);
}

export function useSetLocalData(data: PersistentBroadcastMessage) {
  useBroadcast(LOCAL_DATA_EXAMPLE_CHANNEL, data);
}
