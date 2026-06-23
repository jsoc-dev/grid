"use client";

import Link from "next/link";

type Breadcrumb = {
  label: string;
  href: string;
};

type BreadcrumbProps = {
  crumb: Breadcrumb;
  isLast: boolean;
};

type BreadcrumbsProps = {
  path: string[];
  basePath?: string;
};

export function Breadcrumbs({
  path,
  basePath = "/examples",
}: BreadcrumbsProps) {
  const base = basePath.endsWith("/") ? basePath.slice(0, -1) : basePath;

  // Build up breadcrumbs data
  const breadcrumbs = [
    { label: "Examples", href: base },
    ...path.map((seg, i) => ({
      label: seg,
      href: `${base}/${path.slice(0, i + 1).join("/")}`,
    })),
  ];

  return (
    <nav className="flex justify-center items-center px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-[#0c0c0c]/80 backdrop-blur-md">
      <ol className="flex items-center gap-2 text-sm font-medium">
        {breadcrumbs.map((crumb, i) => (
          <li key={crumb.href} className="flex items-center gap-2 text-sm">
            <Breadcrumb crumb={crumb} isLast={i === breadcrumbs.length - 1} />
          </li>
        ))}
      </ol>
    </nav>
  );
}

function Breadcrumb({ crumb, isLast }: BreadcrumbProps) {
  const { label, href } = crumb;
  if (isLast)
    return <span className="text-neutral-900 dark:text-white">{label}</span>;

  return (
    <>
      <Link
        href={href}
        className="text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white transition-colors"
      >
        {crumb.label}
      </Link>
      <span className="text-neutral-400 dark:text-neutral-600">/</span>
    </>
  );
}
