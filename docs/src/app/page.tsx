import { GITHUB_REPO_BASE_URL } from "@jsoc/grid-docs";
import Link from "next/link";

const USE_CASES = [
  {
    title: "Unknown API Responses",
    description:
      "Display data from APIs where the response schema is not known in advance, without any manual column definition.",
  },
  {
    title: "Rapid Prototyping",
    description:
      "Instantly visualize API data on the UI during early development stages when API designs are frequently changing.",
  },
  {
    title: "Data Viewer Tools",
    description:
      "The perfect underlying engine for building JSON file viewers, database inspection tools, or API response explorers.",
  },
];

export default function HomePage() {
  return (
    <main className="flex min-h-fill-page flex-col items-center py-20 px-6">
      <div className="max-w-4xl w-full space-y-20">
        {/* Hero Section */}
        <section className="space-y-6 max-w-2xl">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            JSOC Grid
          </h1>
          <p className="text-xl text-neutral-600 dark:text-neutral-400 leading-relaxed">
            A headless engine that dynamically generates DataGrid configurations
            at runtime. Built for dynamic and unknown JSON structures.
          </p>
          <div className="flex flex-wrap gap-4 pt-4">
            <Link
              href="/docs/getting-started"
              className="bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 px-6 py-2.5 text-sm font-medium hover:bg-neutral-700 dark:hover:bg-neutral-200 transition-colors"
            >
              Get Started
            </Link>
            <a
              href={GITHUB_REPO_BASE_URL}
              className="border border-neutral-300 dark:border-neutral-700 px-6 py-2.5 text-sm font-medium hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              View on GitHub
            </a>
          </div>
        </section>

        {/* Use Cases Section */}
        <section className="space-y-8 border-t border-neutral-200 dark:border-neutral-800 pt-16">
          <div className="max-w-2xl space-y-4">
            <h2 className="text-2xl font-semibold">
              Built for the dynamic, not the static
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
              If your API schema is fixed and known, standard static
              configurations are recommended. JSOC Grid is specifically designed
              for scenarios where the data shape is unpredictable:
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-8 pt-4">
            {USE_CASES.map((useCase) => (
              <div key={useCase.title} className="space-y-3">
                <h3 className="font-medium text-lg">{useCase.title}</h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  {useCase.description}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
