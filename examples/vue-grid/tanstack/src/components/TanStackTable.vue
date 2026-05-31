<script setup lang="ts">
import type { PluginConfigTanstack } from "@jsoc/vue-grid-tanstack";
import { FlexRender, getCoreRowModel, useVueTable } from "@tanstack/vue-table";
import { computed } from "vue";

const props = defineProps<{
  config: PluginConfigTanstack;
}>();

const table = useVueTable({
  ...props.config,
  getCoreRowModel: getCoreRowModel(),
});

const headerGroups = computed(() => table.getHeaderGroups());
const rows = computed(() => table.getRowModel().rows);
const hasRows = computed(() => rows.value.length > 0);
const hasHeaders = computed(() =>
  headerGroups.value.some((group) => group.headers.length > 0),
);
</script>

<template>
  <p v-if="!hasRows">No rows</p>
  <p v-else-if="!hasHeaders">No columns</p>
  <!-- wrapping in div with overflow: auto to handle horizontal scrolling,
       because standard HTML tables do not support overflow properties directly -->
  <div v-else class="table-container">
    <table>
      <thead>
        <tr v-for="headerGroup in headerGroups" :key="headerGroup.id">
          <th v-for="header in headerGroup.headers" :key="header.id">
            <FlexRender
              v-if="!header.isPlaceholder"
              :render="header.column.columnDef.header"
              :props="header.getContext()"
            />
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in rows" :key="row.id">
          <td v-for="cell in row.getVisibleCells()" :key="cell.id">
            <FlexRender
              :render="cell.column.columnDef.cell"
              :props="cell.getContext()"
            />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
