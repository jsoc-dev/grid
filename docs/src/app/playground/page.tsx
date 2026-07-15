import { PlaygroundContextProvider } from "@/components/playground/PlaygroundContext";
import { PlaygroundHeader } from "@/components/playground/header/PlaygroundHeader";
import { InputPanel } from "@/components/playground/panel/InputPanel";
import { OutputPanel } from "@/components/playground/panel/OutputPanel";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return { title: "Playground" };
}

export default function Page() {
  return (
    <div className="flex flex-1 flex-col p-4 md:p-10 min-h-fill-page">
      <PlaygroundContextProvider>
        <div className="flex w-full flex-1 flex-col overflow-hidden rounded-xl border border-zinc-100 bg-white shadow-2xl shadow-zinc-200/50 dark:border-zinc-800/50 dark:bg-zinc-900 dark:shadow-none">
          <PlaygroundHeader />

          <div className="dot-pattern flex min-h-0 flex-1 flex-col gap-4 overflow-hidden p-4 md:h-[400px] md:flex-row md:gap-8 md:p-8">
            <div className="order-2 flex h-[300px] shrink-0 flex-col min-w-0 md:order-1 md:h-auto md:min-h-0 md:flex-1">
              <InputPanel />
            </div>

            <div className="order-1 flex h-[260px] shrink-0 flex-col min-w-0 md:order-2 md:h-auto md:min-h-0 md:flex-[1.6]">
              <OutputPanel />
            </div>
          </div>
        </div>
      </PlaygroundContextProvider>
    </div>
  );
}
