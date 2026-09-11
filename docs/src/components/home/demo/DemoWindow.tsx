import {
  DemoPluginSelect,
  type ReactGridPluginId,
} from "@/components/home/demo/DemoPluginSelect";
import { ExamplePreview } from "@/components/example-preview/ExamplePreview";
import { StepDots } from "@/components/home/demo/StepDots";
import { TypeWriter } from "@/components/TypeWriter";
import clsx from "clsx";
import { ArrowUpRight, Pause, Play } from "lucide-react";
import Link from "next/link";
import { memo, useState, type ReactNode } from "react";

export type DemoWindowProps = {
  data: string;
  stepIndex: number;
  stepCount: number;
  isPaused: boolean;
  isUserPaused: boolean;
  isStepComplete: boolean;
  waitMs: number;
  typeSpeedMs: number;
  pluginId: ReactGridPluginId;
  onSelectPlugin: (plugin: ReactGridPluginId) => void;
  onTogglePause: () => void;
  onSelectStep: (index: number) => void;
  onTypeComplete: () => void;
};

const MemoizedExamplePreview = memo(function MemoizedPreview() {
  return <ExamplePreview />;
});

export function DemoWindow({
  data,
  stepIndex,
  stepCount,
  isPaused,
  isUserPaused,
  isStepComplete,
  waitMs,
  typeSpeedMs,
  pluginId,
  onSelectPlugin,
  onTogglePause,
  onSelectStep,
  onTypeComplete,
}: DemoWindowProps) {
  const [prevData, setPrevData] = useState(data);
  const [typedProgress, setTypedProgress] = useState(0);
  if (data !== prevData) {
    setPrevData(data);
    setTypedProgress(0);
  }

  return (
    <div className="flex w-full flex-col">
      <div className="w-full overflow-hidden border border-neutral-200 bg-panel-surface dark:border-neutral-800">
        {/* body */}
        <div className="flex flex-col gap-5 p-7">
          <div className="flex flex-col gap-1">
            <div className="flex h-6 items-center">
              <SectionLabel>JSON</SectionLabel>
            </div>
            <TypeWriter
              key={data}
              className="bg-mono min-h-9 border border-panel-outline px-2 py-2 font-mono text-[13px]"
              content={data}
              speed={typeSpeedMs}
              isPaused={isPaused}
              onComplete={onTypeComplete}
              onProgress={setTypedProgress}
            />
          </div>

          <div className="flex flex-col gap-1">
            <div className="flex h-6 items-center justify-between">
              <SectionLabel>Grid</SectionLabel>
              <DemoPluginSelect value={pluginId} onChange={onSelectPlugin} />
            </div>
            <div className="h-44 overflow-hidden">
              <MemoizedExamplePreview key={pluginId} />
            </div>
          </div>
        </div>
      </div>

      {/* controls */}
      <div className="flex items-center justify-center gap-3 pt-4">
        <div
          className={clsx(
            "flex shrink-0 items-center gap-3 p-3",
            "bg-panel-surface border border-neutral-200 rounded-full dark:border-neutral-800",
          )}
        >
          <StepDots
            stepIndex={stepIndex}
            stepCount={stepCount}
            progress={typedProgress}
            isStepComplete={isStepComplete}
            isPaused={isPaused}
            waitMs={waitMs}
            onSelectStep={onSelectStep}
          />
        </div>
        <button
          className={clsx(
            "flex size-8 shrink-0 cursor-pointer items-center justify-center",
            "bg-panel-surface border border-neutral-200 rounded-full",
            "text-neutral-500 transition-colors hover:text-neutral-800 dark:border-neutral-800 dark:text-neutral-400 dark:hover:text-white",
          )}
          type="button"
          aria-label={
            isUserPaused ? "Play carousel autoplay" : "Pause carousel autoplay"
          }
          title={isUserPaused ? "Play" : "Pause"}
          onClick={onTogglePause}
        >
          {isUserPaused ? (
            <Play className="size-3.5 fill-current" aria-hidden="true" />
          ) : (
            <Pause
              className="size-3.5 fill-current"
              strokeWidth={1.5}
              aria-hidden="true"
            />
          )}
        </button>
        <Link
          className={clsx(
            "flex size-8 shrink-0 items-center justify-center",
            "bg-panel-surface border border-neutral-200 rounded-full",
            "text-neutral-500 transition-colors hover:text-neutral-800 dark:border-neutral-800 dark:text-neutral-400 dark:hover:text-white",
          )}
          href={"/playground"}
          target="_blank"
          aria-label="Open playground"
          title="Open playground"
        >
          <ArrowUpRight
            className="size-3.5"
            strokeWidth={4}
            aria-hidden="true"
          />
        </Link>
      </div>
    </div>
  );
}

type SectionLabelProps = {
  children: ReactNode;
};

function SectionLabel({ children }: SectionLabelProps) {
  return (
    <span className="flex items-center justify-between text-[11px] font-medium tracking-wider text-neutral-500 uppercase dark:text-neutral-400">
      {children}
    </span>
  );
}
