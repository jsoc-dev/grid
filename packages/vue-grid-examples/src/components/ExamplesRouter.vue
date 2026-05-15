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
  return props.components[id as keyof typeof props.components];
});

const exampleIds = getExampleIds("vue-grid", props.pluginId);
const pluginName = getPluginMetadata("vue-grid", props.pluginId).name;
</script>

<template>
  <div v-if="activeComponent" class="example-view">
    <component :is="activeComponent" />
  </div>
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
  <p v-if="exampleId && !activeComponent">
    Invalid example ID: "{{ exampleId }}"
  </p>
</template>
