"use client";

import {
  getExampleSourceManifestUrl,
  type ExampleSourceManifest,
  type ExampleSourceFile,
  type AdapterId,
  type PluginId,
} from "@jsoc/grid-docs";
import { useQuery, type UseQueryResult } from "@tanstack/react-query";

export type ExampleSourceQueryResult = UseQueryResult<
  ExampleSourceFile[],
  Error
>;

export function useExampleSource<A extends AdapterId, P extends PluginId<A>>(
  adapterId: A,
  pluginId: P,
): ExampleSourceQueryResult {
  const url = getExampleSourceManifestUrl(adapterId, pluginId);

  const queryFn = async (): Promise<ExampleSourceFile[]> => {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error("Example source not found");
    }

    const manifest = (await res.json()) as ExampleSourceManifest;

    return Object.values(manifest);
  };

  const result = useQuery({ queryKey: ["example-source", url], queryFn });

  return result;
}
