<script setup lang="ts">
import { useExampleIdSearchParam } from "#composables/useExampleIdSearchParam.ts";

import {
  buildExampleIdSearchQuery,
  type ExampleId,
  getExampleIds,
  getExampleMetadata,
  getPluginMetadata,
  type PluginId,
} from "@jsoc/grid-docs";

import { computed, type Component } from "vue";

export type ExamplesRouterProps<
  P extends PluginId<"vue-grid"> = PluginId<"vue-grid">,
> = {
  pluginId: P;
  components: {
    [EId in ExampleId<"vue-grid", P>]: Component;
  };
};

const props = defineProps<ExamplesRouterProps>();

const { exampleId, setExampleId } = useExampleIdSearchParam();

const activeComponent = computed(() => {
  const id = exampleId.value;
  if (!id || !(id in props.components)) {
    return null;
  }
  return props.components[id];
});

const exampleIds = getExampleIds("vue-grid", props.pluginId);
const pluginName = getPluginMetadata("vue-grid", props.pluginId).name;
</script>

<template>
  <template v-if="activeComponent">
    <component :is="activeComponent" />
  </template>

  <p v-else-if="exampleId">Invalid example ID: "{{ exampleId }}"</p>

  <nav v-else>
    <h1>{{ pluginName }} x JSOC Grid</h1>
    <ul>
      <li v-for="id in exampleIds" :key="id">
        <a
          :href="buildExampleIdSearchQuery(id)"
          @click.prevent="setExampleId(id)"
        >
          {{ getExampleMetadata("vue-grid", props.pluginId, id).name }}
        </a>
      </li>
    </ul>
  </nav>
</template>
