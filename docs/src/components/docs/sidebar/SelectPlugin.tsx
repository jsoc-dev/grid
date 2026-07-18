"use client";

import { getPluginIcon } from "@/icons/plugins";
import { Select, SelectSkeleton } from "@/components/Select";
import { useDocsParams, useUpdateDocsParams } from "@/hooks/useDocsParams";
import {
  getPluginIds,
  getPluginMetadata,
  type AdapterId,
} from "@jsoc/grid-docs";
import { useMemo } from "react";

function createOptions(adapterId?: AdapterId) {
  if (!adapterId) return [];
  return getPluginIds(adapterId).map((pluginId) => {
    const pluginMetadata = getPluginMetadata(adapterId, pluginId);
    const Icon = getPluginIcon(adapterId, pluginId);

    return {
      id: pluginId,
      title: pluginMetadata.name,
      icon: <Icon className="x:size-5" height="20" width="20" />,
    };
  });
}

export function SelectPlugin({ disabled }: { disabled?: boolean }) {
  const docsParams = useDocsParams();
  const updateDocsParams = useUpdateDocsParams();
  const adapterId = docsParams?.adapterId;
  const options = useMemo(() => createOptions(adapterId), [adapterId]);

  if (!docsParams) return <SelectSkeleton />;

  return (
    <Select
      onChange={(pluginId) => {
        updateDocsParams({ adapterId: docsParams.adapterId, pluginId });
      }}
      options={options}
      title="Select UI component"
      value={docsParams.pluginId}
      disabled={disabled}
    />
  );
}
