import clsx from "clsx";
import type { ReactNode } from "react";

export function ExamplePageLayout({
  title,
  titleCls,
  children,
}: {
  title: ReactNode;
  titleCls?: string;
  children: ReactNode;
}) {
  return (
    <main className="flex flex-1 flex-col px-6 min-w-0 min-h-0 max-w-full w-full">
      <div className="flex flex-1 flex-col min-h-0 py-12 gap-6 w-full">
        <h1 className={clsx("text-2xl font-semibold text-center", titleCls)}>
          {title}
        </h1>
        {children}
      </div>
    </main>
  );
}
