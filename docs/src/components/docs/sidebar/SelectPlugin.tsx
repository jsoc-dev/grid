"use client";

import { getPluginIcon } from "@/assets/icons/plugins";
import { Select } from "@/components/Select";
import { useDocsParams, useUpdateDocsParams } from "@/hooks/useDocsParams";
import {
  getPluginIds,
  getPluginMetadata,
  isValidPluginId,
} from "@jsoc/grid-docs";
import { useMemo } from "react";

export function SelectPlugin() {
  const docsParams = useDocsParams();
  const updateDocsParams = useUpdateDocsParams();

  const options = useMemo(
    () =>
      getPluginIds(docsParams.adapterId).map((pluginId) => {
        const pluginMetadata = getPluginMetadata(
          docsParams.adapterId,
          pluginId,
        );
        const Icon = getPluginIcon(docsParams.adapterId, pluginId);

        return {
          id: pluginId,
          title: pluginMetadata.name,
          // subtitle: pluginMetadata.packageName,
          icon: <Icon className="x:size-5" height="20" width="20" />,
        };
      }),
    [docsParams.adapterId],
  );

  return (
    <Select
      onChange={(pluginId) => {
        if (!isValidPluginId(docsParams.adapterId, pluginId)) return;
        updateDocsParams({ adapterId: docsParams.adapterId, pluginId });
      }}
      options={options}
      title="Select component"
      value={docsParams.pluginId}
    />
  );
}
