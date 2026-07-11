import { CE_Body } from "@/components/code-explorer/content-panel/body/CE_Body";
import { CE_Header } from "@/components/code-explorer/content-panel/header/CE_Header";
import { Panel } from "react-resizable-panels";

export function CE_ContentPanel() {
  return (
    <Panel id="content">
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden h-full">
        <CE_Header />
        <CE_Body />
      </div>
    </Panel>
  );
}
