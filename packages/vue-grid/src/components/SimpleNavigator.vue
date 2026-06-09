<script setup lang="ts" generic="C extends PluginConfig">
import { useGridStoreSelector } from "#composables/index.ts";

import type { SimpleNavigatorProps } from "#components/SimpleNavigator.ts";

import type { PluginConfig } from "@jsoc/grid-core";
import { computed } from "vue";

const props = defineProps<SimpleNavigatorProps<C>>();

const totalChildSchemas = useGridStoreSelector(
  () => props.gridStore,
  (store) => store.getTotalChildSchemas(),
);
const canRemove = computed(() => totalChildSchemas.value > 0);
const removeActiveSchema = () => props.gridStore.removeChildSchema();
</script>

<template>
  <slot :can-remove="canRemove" :remove-active-schema="removeActiveSchema">
    <button type="button" :disabled="!canRemove" @click="removeActiveSchema">
      {{ canRemove ? "Back" : "Root" }}
    </button>
  </slot>
</template>
