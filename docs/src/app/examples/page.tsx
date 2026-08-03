import { ChooseAdapter } from "@/components/examples/ChooseAdapter";
import { ExamplesPageShell } from "@/components/examples/ExamplesPageShell";
import type { Metadata } from "next";

export function generateMetadata(): Metadata {
  return {
    title: "Examples",
    description:
      "Interactive examples for JSOC Grid across frameworks and UI libraries.",
  };
}

/** Adapter selection page. */
export default function Page() {
  return (
    <ExamplesPageShell>
      <ChooseAdapter />
    </ExamplesPageShell>
  );
}
