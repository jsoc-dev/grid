import Link from "next/link";
import clsx from "clsx";
import FileTypeNpm from "@/icons/file-icons/file_type_npm.svg";
import { GitHubIcon } from "nextra/icons";
import type { SvgIcon } from "@/types/svg";
import type { ReactNode } from "react";

export type PackageCardItem = {
  /** Display title for the card */
  title: string;
  /** npm package name shown below the title */
  packageName: string;
  /** Icon element rendered in the card center */
  icon: ReactNode;
  /** Internal link for the main card body */
  mainLink: string;
  /** GitHub URL for the floating icon link */
  githubLink: string;
};

type PackageCardProps = PackageCardItem;

function PackageCard({
  title,
  packageName,
  icon,
  mainLink,
  githubLink,
}: PackageCardProps) {
  const npmLink = `https://www.npmjs.com/package/${packageName}`;

  return (
    <article
      className={clsx(
        "group relative flex min-h-[260px] flex-col rounded-md",
        "border border-neutral-200 bg-panel-surface",
        "dark:border-neutral-800",
        "transition-[border-color,box-shadow] duration-300",
        "hover:border-neutral-300 hover:shadow-sm",
        "dark:hover:border-neutral-700",
      )}
    >
      {/* floating external links */}
      <div className="absolute top-3 right-3 z-10 flex gap-1.5 opacity-70 group-hover:opacity-100 transition-opacity duration-200">
        <FloatingIconLink
          href={githubLink}
          label="View on GitHub"
          Icon={GitHubIcon}
        />
        <FloatingIconLink
          href={npmLink}
          label="View on npm"
          Icon={FileTypeNpm}
        />
      </div>

      {/* main card link */}
      <Link
        className="flex-1 p-7 flex flex-col items-center justify-center text-center rounded-md transition-colors hover:bg-neutral-200/50 dark:hover:bg-white/3"
        href={mainLink}
      >
        <div className="flex h-14 w-14 items-center justify-center transition-transform duration-300 group-hover:scale-110 [&>svg]:w-full [&>svg]:h-full">
          {icon}
        </div>
        <h3 className="mt-5 mb-1 text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
          {title}
        </h3>
        <div className="font-mono text-sm text-neutral-500 dark:text-neutral-400">
          {packageName}
        </div>
      </Link>
    </article>
  );
}

export function PackageCardGrid({ children }: { children: ReactNode }) {
  return (
    <section className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3 mt-8">
      {children}
    </section>
  );
}

PackageCardGrid.Card = PackageCard;

function FloatingIconLink({
  href,
  label,
  Icon,
}: {
  href: string;
  label: string;
  Icon: SvgIcon;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      title={label}
      className={clsx(
        "flex items-center justify-center rounded-md p-1.5",
        "text-neutral-500 hover:text-neutral-900 hover:bg-neutral-200/80",
        "dark:text-neutral-400 dark:hover:text-neutral-100 dark:hover:bg-neutral-700/60",
        "transition-colors duration-150",
      )}
    >
      <Icon className="size-4" />
    </a>
  );
}
