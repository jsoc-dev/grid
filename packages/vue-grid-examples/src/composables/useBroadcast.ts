import {
  type LocalBroadcastMessage,
  newBroadcastChannel,
  subscribeBroadcastChannel,
} from "@jsoc/grid-examples-shared";
import { onMounted, onUnmounted, type Ref, ref, watch } from "vue";

export function useBroadcast(
  channelName: string,
  message: LocalBroadcastMessage,
) {
  const channel = ref(newBroadcastChannel(channelName));

  watch(
    () => message,
    (value) => {
      if (channel.value.closed) {
        const newChannel = newBroadcastChannel(channelName);
        newChannel.storeAndPostMessage(value);
        channel.value = newChannel;
      } else {
        channel.value.storeAndPostMessage(value);
      }
    },
    { flush: "sync", immediate: true },
  );

  onUnmounted(() => {
    channel.value.close();
  });
}

export function useGetBroadcastMessage(
  channelName: string,
): Ref<LocalBroadcastMessage> {
  const message = ref<LocalBroadcastMessage>();

  if (typeof window !== "undefined") {
    const channel = newBroadcastChannel(channelName);
    message.value = channel.getLastStoredMessage();
    channel.close();
  }

  let unsubscribe: (() => void) | undefined;

  onMounted(() => {
    unsubscribe = subscribeBroadcastChannel(channelName, (value) => {
      message.value = value;
    });
  });

  onUnmounted(() => {
    unsubscribe?.();
  });

  return message;
}
