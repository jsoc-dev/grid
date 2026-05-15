import type { FrameworkId } from "#types.ts";

export type FrameworkMetadata = {
  name: string;
  integrationName: string;
  packageName: string;
};

export type FrameworkMetadataMap = { [key in FrameworkId]: FrameworkMetadata };

const FRAMEWORK_METADATA_MAP: FrameworkMetadataMap = {
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

export function getFrameworkIds(): FrameworkId[] {
  return Object.keys(FRAMEWORK_METADATA_MAP) as FrameworkId[];
}

export function isValidFrameworkId(id: string): id is FrameworkId {
  return getFrameworkIds().includes(id as FrameworkId);
}

export function getFrameworkMetadata<F extends FrameworkId>(
  frameworkId: F,
): FrameworkMetadataMap[F] {
  return FRAMEWORK_METADATA_MAP[frameworkId];
}
