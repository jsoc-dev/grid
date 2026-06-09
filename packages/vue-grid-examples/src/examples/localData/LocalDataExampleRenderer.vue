<script setup lang="ts">
import ErrorMessage from "#shared/ErrorMessage.vue";
import type { ExampleRendererComponent } from "#examples/types.ts";
import {
  type LocalDataExampleRender,
  useMountLocalDataExample,
} from "#examples/localData/useMountLocalDataExample.ts";

const props = defineProps<{
  component: ExampleRendererComponent;
  render: LocalDataExampleRender;
}>();

const { data, error } = useMountLocalDataExample(props.render);
</script>

<template>
  <p v-if="!data">No data</p>
  <ErrorMessage v-else-if="error" :error="error" />
  <component v-else :is="component" :key="data" :data="data" />
</template>
