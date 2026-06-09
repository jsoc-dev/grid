<script setup lang="ts">
import { useFetchRemoteData } from "#examples/remoteData/useFetchRemoteData.ts";
import ErrorMessage from "#shared/ErrorMessage.vue";
import type { ExampleRendererComponent } from "#examples/types.ts";

defineProps<{
  component: ExampleRendererComponent;
}>();

const state = useFetchRemoteData();
</script>

<template>
  <p v-if="state.isLoading">Loading...</p>
  <ErrorMessage v-else-if="state.isError" :error="state.error" />
  <component v-else :is="component" :key="state.data" :data="state.data" />
</template>
