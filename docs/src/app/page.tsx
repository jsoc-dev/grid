import { GITHUB_REPO_BASE_URL } from "@jsoc/grid-docs";
import { ApplicationPreview } from "@/components/home/ApplicationPreview";
import { Demo } from "@/components/home/demo/Demo";
import { SITE_DESCRIPTION, SITE_NAME } from "@/config";
import ChromeIcon from "@/icons/chrome.svg";
import VscodeIcon from "@/icons/vscode.svg";
import { createPageMetadata } from "@/utils/og-metadata";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

export const metadata = createPageMetadata({
  title: SITE_NAME,
  description: SITE_DESCRIPTION,
});

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

const APPLICATIONS = [
  {
    title: "JSON Preview for VS Code",
    platform: "VS Code",
    description:
      "Open JSON and JSONC files as a read-only table beside your editor, with nested navigation and live updates as you edit.",
    previewSrcLight: "/applications/vscode-json-preview-light.mp4",
    previewSrcDark: "/applications/vscode-json-preview-dark.mp4",
    previewAlt:
      "VS Code JSON Preview showing a JSON file beside a generated table preview.",
    href: `${GITHUB_REPO_BASE_URL}/tree/main/apps/vscode-json-preview`,
  },
  {
    title: "JSON Preview for Browser",
    platform: "Browser",
    description:
      "Turn JSON URLs and API responses into a table view directly in Chrome or any Chromium browser, while keeping raw JSON one click away.",
    previewSrcLight: "/applications/browser-json-preview-light.mp4",
    previewSrcDark: "/applications/browser-json-preview-dark.mp4",
    previewAlt:
      "Browser JSON Preview toggling between raw JSON and a generated table preview.",
    href: `${GITHUB_REPO_BASE_URL}/tree/main/apps/browser-json-preview`,
  },
];

const PREVIEW_IMAGE_CLASS_NAME =
  "h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.01]";

export default function HomePage() {
  return (
    <main className="flex min-h-fill-page flex-col items-center py-20 px-6">
      <div className="max-w-(--nextra-content-width) w-full space-y-20">
        {/* Hero Section */}
        <section className="flex flex-col items-center gap-10 lg:flex-row lg:gap-12">
          <div className="flex w-full min-w-0 flex-1 flex-col gap-6">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              {SITE_NAME}
            </h1>
            <p className="text-xl text-neutral-600 dark:text-neutral-400 leading-relaxed">
              {SITE_DESCRIPTION}
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
          </div>

          <div className="w-full min-w-0 flex-1">
            <Demo />
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

        {/* Applications Section */}
        <section className="space-y-8 border-t border-neutral-200 pt-16 dark:border-neutral-800">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div className="max-w-2xl space-y-4">
              <h2 className="text-2xl font-semibold">Built with JSOC Grid</h2>
              <p className="leading-relaxed text-neutral-600 dark:text-neutral-400">
                These extensions use JSOC Grid to turn unknown JSON structures
                into practical table previews in the tools developers already
                use.
              </p>
            </div>
          </div>

          <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
            {APPLICATIONS.map((application) => {
              const PlatformIcon =
                application.platform === "VS Code" ? VscodeIcon : ChromeIcon;
              return (
                <article
                  key={application.title}
                  className="group overflow-hidden rounded-md border border-neutral-200 bg-panel-surface transition-[border-color,box-shadow,transform] duration-300 hover:border-neutral-300 hover:shadow-sm dark:border-neutral-800 dark:hover:border-neutral-700"
                >
                  <div className="relative aspect-16/10 overflow-hidden border-b border-neutral-200 bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-900">
                    <ApplicationPreview
                      className={PREVIEW_IMAGE_CLASS_NAME}
                      srcLight={application.previewSrcLight}
                      srcDark={application.previewSrcDark}
                      alt={application.previewAlt}
                    />
                  </div>
                  <a
                    href={application.href}
                    className="flex items-center gap-6 p-6"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <div className="pointer-events-none hidden h-10 w-10 shrink-0 overflow-hidden rounded-xl border border-neutral-200 bg-neutral-100 p-1 shadow-[0_4px_12px_rgba(0,0,0,0.12)] sm:block dark:border-white dark:bg-white">
                      <PlatformIcon
                        className="h-full w-full"
                        role="img"
                        aria-label={application.platform}
                      />
                    </div>
                    <div className="min-w-0 space-y-3">
                      <h3 className="text-xl font-semibold tracking-tight">
                        {application.title}
                      </h3>
                      <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                        {application.description}
                      </p>
                      <span className="inline-flex items-center gap-1.5 pt-1 text-sm font-medium text-neutral-900 group-hover:text-accent-700 dark:text-neutral-100 dark:group-hover:text-accent-300">
                        Learn more
                        <ArrowUpRight className="size-4" aria-hidden="true" />
                      </span>
                    </div>
                  </a>
                </article>
              );
            })}
          </div>

          <div className="mx-auto max-w-3xl rounded-md border border-neutral-200 bg-panel-surface p-8 text-center sm:p-10 dark:border-neutral-800">
            <h3 className="text-xl font-semibold tracking-tight">
              Want to see or build a tool powered by JSOC Grid?
            </h3>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-neutral-600 sm:text-base dark:text-neutral-400">
              JSOC Grid turns unknown JSON structures into practical table
              previews. Get started in minutes, or head to the repo to talk
              through your use case.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/docs/getting-started"
                className="bg-neutral-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-neutral-700 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
              >
                Get Started
              </Link>
              <a
                href={`${GITHUB_REPO_BASE_URL}/discussions`}
                target="_blank"
                rel="noopener noreferrer"
                className="border border-neutral-300 px-5 py-2.5 text-sm font-medium transition-colors hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-800"
              >
                Share your idea
              </a>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
