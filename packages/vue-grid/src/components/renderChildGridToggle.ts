import type { ChildGridToggleProps } from "#components/ChildGridToggle.ts";
import ChildGridToggle from "#components/ChildGridToggle.vue";

import type { PluginConfig } from "@jsoc/grid-core";
import { h } from "vue";

type ChildGridToggleRuntimeProps = ChildGridToggleProps<PluginConfig>;

/** Renders {@link ChildGridToggle} with given props. */
export function renderChildGridToggle<C extends PluginConfig>(
  props: ChildGridToggleProps<C>,
) {
  const runtimeProps: ChildGridToggleRuntimeProps = {
    columnParams:
      props.columnParams as unknown as ChildGridToggleRuntimeProps["columnParams"],
    row: props.row,
  };
  return h(ChildGridToggle, runtimeProps);
}
