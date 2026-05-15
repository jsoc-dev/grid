import { Playground } from "@/components/playground/Playground";

export function PlaygroundSection() {
  return (
    <section className="relative z-10 py-10  bg-zinc-50/30  dark:bg-zinc-900/10">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="mb-10 text-center">
          <h2 className="mb-3 text-3xl font-bold text-zinc-900 dark:text-zinc-50 md:text-4xl">
            Quick Look
          </h2>
          <p className="mx-auto max-w-xl text-zinc-500 dark:text-zinc-400">
            Edit the json and watch the grid rows and columns change
            automatically.
          </p>
        </div>

        {/* Playground card */}
        <div className="relative overflow-hidden rounded-2xl border border-zinc-200/80 bg-white shadow-2xl shadow-zinc-900/5 dark:border-zinc-800/80 dark:bg-zinc-900 dark:shadow-black/30">
          {/* Top accent bar */}
          <div className="h-px w-full bg-linear-to-r from-transparent via-accent-500/60 to-transparent" />
          <Playground />
        </div>
      </div>
    </section>
  );
}
