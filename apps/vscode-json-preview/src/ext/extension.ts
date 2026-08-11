import { handleOpenPreviewToSide } from "#ext/commands/openPreviewToSide.ts";
import {
  handleReopenAsPreview,
  handleReopenAsSource,
} from "#ext/commands/reopen.ts";
import { handleShowSource } from "#ext/commands/showSource.ts";
import { CommandId } from "#ext/constants.ts";
import { previewPanelStore } from "#ext/panels/PreviewPanelStore.ts";
import { PreviewEditorProvider } from "#ext/providers/PreviewEditorProvider.ts";
import * as vscode from "vscode";

export function activate(ctx: vscode.ExtensionContext) {
  ctx.subscriptions.push(
    vscode.window.registerCustomEditorProvider(
      PreviewEditorProvider.viewType,
      new PreviewEditorProvider(ctx.extensionUri),
    ),
    vscode.commands.registerCommand(CommandId.OpenPreviewToSide, () =>
      handleOpenPreviewToSide(ctx),
    ),
    vscode.commands.registerCommand(CommandId.ShowSource, () =>
      handleShowSource(),
    ),
    vscode.commands.registerCommand(CommandId.ReopenAsPreview, () =>
      handleReopenAsPreview(),
    ),
    vscode.commands.registerCommand(CommandId.ReopenAsSource, () =>
      handleReopenAsSource(),
    ),
  );
}

export function deactivate() {
  previewPanelStore.closeAll();
}
