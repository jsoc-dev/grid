<script setup lang="ts">
import RemoteDataExample from "./RemoteDataExample.vue";
import { useGetRemoteJSON } from "@jsoc/vue-grid-examples";

const { data, loading, error } = useGetRemoteJSON();
</script>

<template>
  <p v-if="loading">Loading...</p>
  <p v-else-if="error instanceof Error">Error: {{ error.message }}</p>
  <p v-else-if="!data">No data</p>
  <RemoteDataExample v-else :data="data" />
</template>
