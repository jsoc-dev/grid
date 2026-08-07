import {
  useBroadcast,
  useGetBroadcastMessage,
} from "#examples/localData/useBroadcast.ts";

import {
  LOCAL_DATA_EXAMPLE_CHANNEL,
  type PersistentBroadcastMessage,
} from "@jsoc/grid-examples-core";
import type { MaybeRefOrGetter } from "vue";

export function useGetLocalData() {
  return useGetBroadcastMessage(LOCAL_DATA_EXAMPLE_CHANNEL);
}

export function useSetLocalData(
  data: MaybeRefOrGetter<PersistentBroadcastMessage>,
) {
  useBroadcast(LOCAL_DATA_EXAMPLE_CHANNEL, data);
}
