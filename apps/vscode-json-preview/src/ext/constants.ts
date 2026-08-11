import packageJson from "#package.json" with { type: "json" };

export const EXTENSION_NAME = packageJson.name;
export const EXTENSION_DISPLAY_NAME = packageJson.displayName;

/** Qualifies a name with the extension name prefix, e.g. "foo" → \`${EXTENSION_NAME}.foo\` */
const qualify = <T extends string>(name: T): `${typeof EXTENSION_NAME}.${T}` =>
  `${EXTENSION_NAME}.${name}`;

export const CommandId = {
  OpenPreviewToSide: qualify("openPreviewToSide"),
  ShowSource: qualify("showSource"),
  ReopenAsPreview: qualify("reopenAsPreview"),
  ReopenAsSource: qualify("reopenAsSource"),
} as const;

export type CommandId = (typeof CommandId)[keyof typeof CommandId];

export const ViewType = {
  PreviewPanel: qualify("previewPanel"),
  PreviewEditor: qualify("previewEditor"),
} as const;

export type ViewType = (typeof ViewType)[keyof typeof ViewType];

export const DEFAULT_FILE_NAME = "untitled.json";
