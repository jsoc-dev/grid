import type { AdapterId } from "#types.ts";

export type AdapterMetadata = {
  name: string;
  integrationName: string;
  packageName: string;
};

export type AdapterMetadataMap = { [key in AdapterId]: AdapterMetadata };

const ADAPTER_METADATA_MAP: AdapterMetadataMap = {
  "react-grid": {
    name: "React",
    integrationName: "React Grid",
    packageName: "@jsoc/react-grid",
  },
  "vue-grid": {
    name: "Vue",
    integrationName: "Vue Grid",
    packageName: "@jsoc/vue-grid",
  },
  "vanilla-grid": {
    name: "Vanilla",
    integrationName: "Vanilla Grid",
    packageName: "@jsoc/vanilla-grid",
  },
};

export function getAdapterIds(): AdapterId[] {
  return Object.keys(ADAPTER_METADATA_MAP) as AdapterId[];
}

export function isValidAdapterId(id: string): id is AdapterId {
  return getAdapterIds().includes(id as AdapterId);
}

export function getAdapterMetadata<A extends AdapterId>(
  adapterId: A,
): AdapterMetadataMap[A] {
  return ADAPTER_METADATA_MAP[adapterId];
}
