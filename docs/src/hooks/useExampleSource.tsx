"use client";

import {
  getExampleSourceManifestUrl,
  type ExampleSourceManifest,
  extractSourceFilesFromManifest,
  type ExampleSourceFile,
  type AdapterId,
  type PluginId,
} from "@jsoc/grid-docs";
import { useQuery } from "@tanstack/react-query";

export function useExampleSource<A extends AdapterId, P extends PluginId<A>>(
  adapterId: A,
  pluginId: P,
) {
  const url = getExampleSourceManifestUrl(adapterId, pluginId);

  const queryFn = async (): Promise<ExampleSourceFile[]> => {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error("Example source not found");
    }

    const manifest = (await res.json()) as ExampleSourceManifest;

    return extractSourceFilesFromManifest(manifest);
  };

  const result = useQuery({ queryKey: ["example-source", url], queryFn });

  return { ...result, files: result.data };
}
