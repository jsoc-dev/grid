import { clsx } from "clsx";

export type StepDotsProps = {
  stepIndex: number;
  stepCount: number;
  progress: number;
  isStepComplete: boolean;
  isPaused: boolean;
  waitMs: number;
  onSelectStep: (index: number) => void;
};

export function StepDots({
  stepIndex,
  stepCount,
  progress,
  isStepComplete,
  isPaused,
  waitMs,
  onSelectStep,
}: StepDotsProps) {
  return (
    <span className="flex items-center gap-3">
      {Array.from({ length: stepCount }, (_, i) => (
        <button
          key={i}
          type="button"
          onClick={() => onSelectStep(i)}
          aria-label={`Show payload ${i + 1} of ${stepCount}`}
          aria-current={i === stepIndex ? "true" : undefined}
          className={clsx(
            "group -m-1.5 cursor-pointer p-1.5",
            i !== stepIndex && "cursor-pointer",
          )}
        >
          <span
            aria-hidden="true"
            style={{ width: i === stepIndex ? 32 : 8 }}
            className={clsx(
              "relative block h-2 overflow-clip rounded-full transition-all duration-300 ease-out",
              "bg-neutral-900/15 group-hover:bg-neutral-900/25 dark:bg-white/20 dark:group-hover:bg-white/30",
            )}
          >
            {i === stepIndex && (
              <span
                aria-hidden="true"
                style={{
                  transform: `scaleX(${progress})`,
                }}
                className="absolute inset-y-0 left-0 h-full w-full origin-left rounded-full bg-neutral-900/20 transition-transform duration-100 ease-linear dark:bg-white/30"
              />
            )}
            {i === stepIndex && isStepComplete && (
              <span
                aria-hidden="true"
                style={{
                  animationDuration: `${waitMs}ms`,
                }}
                className={clsx(
                  "absolute inset-y-0 left-0 h-full w-full origin-left animate-fill rounded-full bg-neutral-900/70 dark:bg-white/80",
                  isPaused && "[animation-play-state:paused]",
                )}
              />
            )}
          </span>
        </button>
      ))}
    </span>
  );
}
