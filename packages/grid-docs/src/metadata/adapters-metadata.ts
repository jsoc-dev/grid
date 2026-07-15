import type { AdapterId, UpcomingAdapterId } from "#types/plugins.ts";

export type AdapterMetadata<id extends AdapterId> = {
  id: id;
  name: string;
  frameworkName: string;
  packageName: string;
};

export type AdapterMetadataMap = { [id in AdapterId]: AdapterMetadata<id> };

const ADAPTER_METADATA_MAP: AdapterMetadataMap = {
  "react-grid": {
    id: "react-grid",
    name: "React Grid",
    frameworkName: "React",
    packageName: "@jsoc/react-grid",
  },
  "vanilla-grid": {
    id: "vanilla-grid",
    name: "Vanilla Grid",
    frameworkName: "Vanilla",
    packageName: "@jsoc/vanilla-grid",
  },
  "vue-grid": {
    id: "vue-grid",
    name: "Vue Grid",
    frameworkName: "Vue",
    packageName: "@jsoc/vue-grid",
  },
};

export function getAdapterIds(): AdapterId[] {
  return Object.keys(ADAPTER_METADATA_MAP) as AdapterId[];
}

export function getUpcomingAdapterIds(): UpcomingAdapterId[] {
  return ["angular-grid"];
}

export function isValidAdapterId(id: string): id is AdapterId {
  return getAdapterIds().includes(id as AdapterId);
}

export function getAdapterMetadata<A extends AdapterId>(
  adapterId: A,
): AdapterMetadataMap[A] {
  return ADAPTER_METADATA_MAP[adapterId];
}

export function getAllAdapterMetadata(): AdapterMetadata<AdapterId>[] {
  return Object.values(ADAPTER_METADATA_MAP);
}
