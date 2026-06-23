"use client";

import { ADAPTER_ID_PARAM_KEY } from "@/constants/docs";
import { useDocsParams } from "@/hooks/useDocsParams";
import { getAdapterMetadata, type AdapterMetadata } from "@jsoc/grid-docs";

type Props = {
  metaKey: keyof AdapterMetadata;
};

export function AdapterMeta({ metaKey }: Props) {
  const docsParams = useDocsParams();
  const adapterMetadata = getAdapterMetadata(docsParams[ADAPTER_ID_PARAM_KEY]);
  return adapterMetadata[metaKey];
}
