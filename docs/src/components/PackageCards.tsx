import FileTypeNpm from "@/icons/file-icons/file_type_npm.svg";
import { GitHubIcon } from "nextra/icons";
import type { SvgIcon } from "@/types/svg";
import type { ReactNode } from "react";
import clsx from "clsx";
import { Cards } from "@/components/Cards";

export function PackageCards({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <Cards className={className}>{children}</Cards>;
}

PackageCards.Card = PackageCard;

type PackageCardBase<T extends string = string> = {
  /** The unique ID of the card, passed to getters */
  id: T;
  /** Display title for the card */
  title: string;
  /** npm package name shown below the title */
  packageName?: string;
  /** Icon element rendered in the card center */
  icon: ReactNode;
  /** GitHub URL for the floating icon link */
  githubLink?: string;
  /** Badge text */
  badge?: string;
};

export type PackageCardItem<T extends string = string> = PackageCardBase<T> &
  (
    | { disabled?: false; mainLink: string | ((id: T) => string) }
    | { disabled: true; mainLink?: string | ((id: T) => string) }
  );

function PackageCard<T extends string = string>({
  id,
  title,
  packageName,
  icon,
  mainLink,
  githubLink,
  disabled,
  badge,
}: PackageCardItem<T>) {
  const npmLink =
    packageName && packageName !== "Coming soon"
      ? `https://www.npmjs.com/package/${packageName}`
      : undefined;

  const evaluatedMainLink =
    typeof mainLink === "function" ? mainLink(id) : mainLink;

  return (
    <Cards.Card
      title={title}
      subtitle={packageName}
      icon={icon}
      mainLink={evaluatedMainLink}
      disabled={disabled}
      badge={badge}
    >
      {/* floating external links */}
      {!disabled && (githubLink || npmLink) && (
        <div className="absolute top-3 right-3 z-10 flex gap-1.5 opacity-70 group-hover:opacity-100 transition-opacity duration-200">
          {githubLink && (
            <FloatingIconLink
              href={githubLink}
              label="View on GitHub"
              Icon={GitHubIcon}
            />
          )}
          {npmLink && (
            <FloatingIconLink
              href={npmLink}
              label="View on npm"
              Icon={FileTypeNpm}
            />
          )}
        </div>
      )}
    </Cards.Card>
  );
}

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
