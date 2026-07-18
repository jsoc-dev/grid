"use client";

import { getAdapterIcon } from "@/icons/adapters";
import { Select } from "@/components/Select";
import { useDocsParams, useUpdateDocsParams } from "@/hooks/useDocsParams";
import { getDefaultPluginId } from "@/utils/docsParams";
import {
  getAdapterIds,
  getAdapterMetadata,
  isValidPluginId,
} from "@jsoc/grid-docs";

const options = getAdapterIds().map((adapterId) => {
  const adapterMetadata = getAdapterMetadata(adapterId);
  const Icon = getAdapterIcon(adapterId);

  return {
    id: adapterId,
    title: adapterMetadata.frameworkName,
    icon: <Icon className="x:size-5" height="20" width="20" />,
  };
});

export function SelectAdapter({ disabled }: { disabled?: boolean }) {
  const docsParams = useDocsParams();
  const updateDocsParams = useUpdateDocsParams();

  if (!docsParams) {
    return <div className="h-9 w-full"></div>;
  }

  return (
    <Select
      onChange={(adapterId) => {
        const pluginId = isValidPluginId(adapterId, docsParams.pluginId)
          ? docsParams.pluginId // use current pluginId if it's valid for the new adapterId
          : getDefaultPluginId(adapterId); // reset to default plugin based on newly selected adapterId

        updateDocsParams({ adapterId, pluginId });
      }}
      options={options}
      title="Select framework"
      value={docsParams.adapterId}
      disabled={disabled}
    />
  );
}
