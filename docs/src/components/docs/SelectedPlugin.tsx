"use client";

import { formatValue } from "@/components/docs/format-value";
import { useRootContext } from "@/contexts/RootContext";
import {
  getPluginMetadata,
  type PluginMetadataProperty,
} from "@jsoc/grid-docs";

type Props = {
  [P in PluginMetadataProperty]: boolean;
};

export function SelectedPlugin(props: Props) {
  const { selectedFrameworkId, selectedPluginId } = useRootContext();

  for (const [property, show] of Object.entries(props)) {
    if (show) {
      const metdata = getPluginMetadata(selectedFrameworkId, selectedPluginId);

      return formatValue(metdata[property as PluginMetadataProperty]);
    }
  }
}
