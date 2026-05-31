<script setup lang="ts">
import { Basic, LocalData, RemoteData } from "#/examples/index.ts";
import { ExamplesRouter, useDetectColorScheme } from "@jsoc/vue-grid-examples";
import { watchEffect } from "vue";

const colorScheme = useDetectColorScheme();

watchEffect(() => {
  document.documentElement.classList.toggle("dark", colorScheme.value === "dark");
});
</script>

<template>
  <ExamplesRouter
    plugin-id="tanstack"
    :components="{
      basic: Basic,
      'local-data': LocalData,
      'remote-data': RemoteData,
    }"
  />
</template>
