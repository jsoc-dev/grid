<script setup lang="ts" generic="C extends PluginConfig">
import { useGridStoreSelector } from "#composables/index.ts";

import type { ChildGridToggleProps } from "#components/ChildGridToggle.ts";

import type { PluginConfig } from "@jsoc/grid-core";
import { computed } from "vue";

const props = defineProps<ChildGridToggleProps<C>>();

const gridStore = computed(() => props.columnParams.gridSchema.store);
const origin = computed(() =>
  gridStore.value.getChildSchemaOrigin(props.row, props.columnParams.columnKey),
);
const toggleStatus = useGridStoreSelector(gridStore, (store) =>
  store.hasChildSchema(origin.value),
);
const toggle = () => gridStore.value.toggleChildSchema(origin.value);
</script>

<template>
  <slot :toggle="toggle" :toggle-status="toggleStatus">
    <button type="button" @click="toggle">
      {{ toggleStatus ? "Close" : "View" }}
    </button>
  </slot>
</template>
