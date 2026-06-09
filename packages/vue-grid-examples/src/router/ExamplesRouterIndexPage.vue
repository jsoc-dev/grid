<script setup lang="ts">
import type { ExamplesRouterOptions } from "#router/types.ts";
import { useExampleIdSearchParam } from "#router/useExampleIdSearchParam.ts";

import {
  buildExampleIdSearchQuery,
  getExampleIds,
  getExampleMetadata,
  getPluginMetadata,
} from "@jsoc/grid-docs";

const props = defineProps<Pick<ExamplesRouterOptions, "pluginId">>();

const { setExampleId } = useExampleIdSearchParam();

const exampleIds = getExampleIds("vue-grid", props.pluginId);
const pluginName = getPluginMetadata("vue-grid", props.pluginId).name;
</script>

<template>
  <nav>
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
