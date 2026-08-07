<script setup lang="ts">
import ErrorMessage from "#shared/ErrorMessage.vue";
import LocalDataEditor from "#examples/localData/LocalDataEditor.vue";
import type { ExampleRendererComponent } from "#examples/types.ts";
import {
  type LocalDataExampleRender,
  useMountLocalDataExample,
} from "#examples/localData/useMountLocalDataExample.ts";

import { getLocalDataEditorEnabled } from "@jsoc/grid-examples-core";

const props = defineProps<{
  component: ExampleRendererComponent;
  render: LocalDataExampleRender;
}>();

const { data, error } = useMountLocalDataExample(props.render);
const showEditor = getLocalDataEditorEnabled();
</script>

<template>
  <p v-if="!data">No data</p>
  <ErrorMessage v-else-if="error" :error="error" />
  <component v-else-if="data" :is="component" :key="data" :data="data" />
  <LocalDataEditor v-if="showEditor" />
</template>
