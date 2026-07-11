import { CE_FileInfo } from "@/components/code-explorer/content-panel/header/CE_FileInfo";
import { CE_LanguagePreference } from "@/components/code-explorer/content-panel/header/CE_LanguagePreference";

export function CE_Header() {
  return (
    <div className=" border-b border-panel-outline flex h-10 shrink-0 items-stretch ">
      <CE_FileInfo />
      <CE_LanguagePreference />
    </div>
  );
}
