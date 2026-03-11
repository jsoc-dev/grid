import Link from "next/link";

const features = [
  {
    title: "Dynamic Grid",
    description:
      "No more rigid definitions. Columns automatically adapt to your JSON structure.",
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 6h16M4 10h16M4 14h16M4 18h16"
        />
      </svg>
    ),
  },
  {
    title: "JSON-First",
    description:
      "The source of truth is your data. Render entire dashboards from a single JSON endpoint.",
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
        />
      </svg>
    ),
  },
  {
    title: "Eco-Agnostic",
    description:
      "Swap between MUI, Radix, or Ag-Grid with a single prop. Zero vendor lock-in.",
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
        />
      </svg>
    ),
  },
];

export default function Page() {
  return (
    <div className="relative isolate min-h-screen">
      {/* Decorative background blobs */}
      <div className="blob -top-24 -left-20 animate-float opacity-30 dark:opacity-10" />
      <div
        className="blob top-1/2 -right-24 animate-float opacity-20 dark:opacity-10"
        style={{ animationDelay: "2s" }}
      />

      <main className="px-controlled py-20 sm:py-32 flex flex-col items-center">
        {/* Hero Section */}
        <section className="text-center max-w-4xl mx-auto space-y-8 mb-24">
          <h1 className="text-5xl sm:text-7xl font-bold tracking-tight text-foreground leading-[1.1]">
            The Smart Way to Render{" "}
            <span className="bg-clip-text text-transparent bg-linear-to-b from-foreground via-foreground/90 to-foreground/70">
              Dynamic JSON Data
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed font-medium">
            JSOC Grid is an adaptive, developer-first framework that turns raw
            JSON into powerful, interactive interfaces without the boilerplate.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
            <Link
              href="/documentation/grid/"
              className="w-full sm:w-auto px-8 py-3 text-primary-foreground font-semibold rounded-md bg-primary hover:opacity-90 transition-all duration-200 shadow-sm active:scale-95"
            >
              Get Started
            </Link>
            <Link
              href="/playground/grid/"
              className="w-full sm:w-auto px-8 py-3 text-foreground font-semibold rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-all duration-200 active:scale-95 flex items-center justify-center gap-2 group"
            >
              Playground
              <span className="group-hover:translate-x-1 transition-transform">
                →
              </span>
            </Link>
          </div>
        </section>


        {/* Features Grid */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl mt-6 mx-auto">
          {features.map((feature, i) => (
            <div
              key={i}
              className="group flex flex-col p-8 rounded-xl border border-border bg-card/50 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5"
            >
              <div className="mb-6 inline-flex p-2.5 rounded-lg bg-primary/10 text-primary border border-primary/10 transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3 transition-colors group-hover:text-primary">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed text-sm font-medium">
                {feature.description}
              </p>
            </div>
          ))}
        </section>


      </main>
    </div>
  );
}

