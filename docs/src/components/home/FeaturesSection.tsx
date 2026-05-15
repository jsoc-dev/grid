import { Zap, Globe, Plug, type LucideIcon } from "lucide-react";

type Feature = {
  title: string;
  description: string;
  Icon: LucideIcon;
};

const features: Feature[] = [
  {
    title: "Dynamic configurations",
    description:
      "Designed to handle dynamic data. So, if your API model changes, you do not need to reconfigure your grid component.",
    Icon: Zap,
  },
  {
    title: "Plugin system",
    description:
      "Use it with your favourite DataGrid component. Plugins available for AG-Grid, MUI DataGrid, TanStack Table, and more... ",
    Icon: Plug,
  },
  {
    title: "Framework agnostic",
    description:
      "Framework agnostic core library. Use it in your React, Vue, Angular, or even Vanilla JavaScript apps.",
    Icon: Globe,
  },
];

export function FeaturesSection() {
  return (
    <section className="relative py-10 pb-20">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-6 md:grid-cols-3">
          {features.map((feature, i) => (
            <FeatureCard key={i} {...feature} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FeatureCard({ title, description, Icon }: Feature) {
  return (
    <div className="relative rounded-2xl border border-zinc-100 bg-white p-6 shadow-sm dark:border-zinc-800/60 dark:bg-zinc-900/60">
      {/* Icon */}
      <div className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-xl border border-accent-100 bg-accent-50 text-accent-600 dark:border-accent-500/10 dark:bg-accent-500/10 dark:text-accent-400">
        <Icon className="h-5 w-5" />
      </div>

      <h3 className="mb-2 font-semibold text-zinc-900 dark:text-zinc-50">
        {title}
      </h3>
      <p className="text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
        {description}
      </p>
    </div>
  );
}
