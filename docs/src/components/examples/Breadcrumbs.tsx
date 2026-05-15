"use client";

import Link from "next/link";

export function Breadcrumbs(props: { path: string[] }) {
  const { path } = props;

  // Build up breadcrumbs data
  const breadcrumbs = [
    { label: "Frameworks", href: "/examples" },
    ...path.map((seg, i) => ({
      label: seg,
      href: `/examples/${path.slice(0, i + 1).join("/")}`,
    })),
  ];

  return (
    <nav className="flex justify-center items-center px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-[#0c0c0c]/80 backdrop-blur-md">
      <ol className="flex items-center gap-2 text-sm font-medium">
        {breadcrumbs.map((crumb, i) => {
          const isLast = i === breadcrumbs.length - 1;
          return (
            <li key={crumb.href} className="flex items-center gap-2 text-sm">
              {i > 0 && (
                <span className="text-neutral-400 dark:text-neutral-600">
                  /
                </span>
              )}
              {isLast ? (
                <span className="text-neutral-900 dark:text-white">
                  {crumb.label}
                </span>
              ) : (
                <Link
                  href={crumb.href}
                  className="text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white transition-colors"
                >
                  {crumb.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
