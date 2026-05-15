import { Playground } from "@/components/playground/Playground";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const title = `Playground`;
  return { title };
}

export default function Page() {
  return (
    <div className="flex flex-1 flex-col p-10 min-h-[calc(100dvh-var(--nextra-navbar-height))]">
      <div>Playground</div>
      <Playground />
    </div>
  );
}
