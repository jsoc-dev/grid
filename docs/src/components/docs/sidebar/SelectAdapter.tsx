"use client";

import { getAdapterIcon } from "@/icons/adapters";
import { Select } from "@/components/Select";
import { useDocsParams, useUpdateDocsParams } from "@/hooks/useDocsParams";
import {
  getAdapterIds,
  getAdapterMetadata,
  getPluginIds,
  isValidPluginId,
} from "@jsoc/grid-docs";
import { useMemo } from "react";

export function SelectAdapter({ disabled }: { disabled?: boolean }) {
  const docsParams = useDocsParams();
  const updateDocsParams = useUpdateDocsParams();

  const options = useMemo(
    () =>
      getAdapterIds().map((adapterId) => {
        const adapterMetadata = getAdapterMetadata(adapterId);
        const Icon = getAdapterIcon(adapterId);

        return {
          id: adapterId,
          title: adapterMetadata.frameworkName,
          // subtitle: adapterMetadata.packageName,
          icon: <Icon className="x:size-5" height="20" width="20" />,
        };
      }),
    [],
  );

  return (
    <Select
      onChange={(adapterId) => {
        const pluginId = isValidPluginId(adapterId, docsParams.pluginId)
          ? docsParams.pluginId // use current pluginId if it's valid for the new adapterId
          : getPluginIds(adapterId)[0]; // reset to default plugin based on newly selected adapterId

        updateDocsParams({ adapterId, pluginId });
      }}
      options={options}
      title="Select framework"
      value={docsParams.adapterId}
      disabled={disabled}
    />
  );
}
