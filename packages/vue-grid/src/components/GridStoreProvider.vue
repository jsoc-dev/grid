<script setup lang="ts" generic="C extends PluginConfig">
import { gridStoreInjectionKey } from "#internals/injection.ts";

import type { GridStore, PluginConfig } from "@jsoc/grid-core";
import { provide, toRef } from "vue";

export type GridStoreProviderProps<C extends PluginConfig> = {
  value: GridStore<C>;
};

const props = defineProps<{
  value: GridStore<C>;
}>();

provide(
  gridStoreInjectionKey,
  toRef(() => props.value as GridStore<PluginConfig>),
);
</script>

<template>
  <slot />
</template>
