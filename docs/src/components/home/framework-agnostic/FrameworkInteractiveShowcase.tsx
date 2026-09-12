"use client";

import { useState } from "react";
import {
  FrameworkFlowDiagram,
  type FrameworkFlowAdapterId,
} from "@/components/home/framework-agnostic/FrameworkFlowDiagram";
import {
  FrameworkCodePreview,
  type FrameworkSnippetData,
} from "@/components/home/framework-agnostic/FrameworkCodePreview";

export type FrameworkInteractiveShowcaseProps = {
  snippets: Record<FrameworkFlowAdapterId, FrameworkSnippetData>;
};

export function FrameworkInteractiveShowcase({
  snippets,
}: FrameworkInteractiveShowcaseProps) {
  const [activeFramework, setActiveFramework] =
    useState<FrameworkFlowAdapterId>("react-grid");

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <FrameworkFlowDiagram
        activeFramework={activeFramework}
        onSelectFramework={setActiveFramework}
      />
      <FrameworkCodePreview
        activeFramework={activeFramework}
        onSelectFramework={setActiveFramework}
        snippets={snippets}
      />
    </div>
  );
}
