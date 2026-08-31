import errorIconSvg from "#assets/error.svg?raw";
import infoIconSvg from "#assets/info.svg?raw";
import warningIconSvg from "#assets/warning.svg?raw";

import { clsx } from "clsx";

export type PlaceholderType = "info" | "warning" | "error";

export type PlaceholderProps = {
  type: PlaceholderType;
  title: string;
  description?: string | null;
};

const ICONS: Record<PlaceholderType, string> = {
  info: infoIconSvg,
  warning: warningIconSvg,
  error: errorIconSvg,
};

const ICON_COLORS: Record<PlaceholderType, string> = {
  info: "text-info",
  warning: "text-warning",
  error: "text-error",
};

export function Placeholder({ type, title, description }: PlaceholderProps) {
  const iconSvg = ICONS[type];

  return (
    <div className="flex flex-col items-center justify-center grow min-h-[calc(100vh-6rem)] w-full p-8 text-center">
      <div
        className={clsx(
          "w-12 h-12 mb-4 [&>svg]:w-full [&>svg]:h-full [&>svg]:fill-current",
          ICON_COLORS[type],
        )}
        dangerouslySetInnerHTML={{ __html: iconSvg }}
      />
      <div className="text-sm font-normal wrap-break-word leading-normal mb-1">
        {title}
      </div>
      {description && (
        <div className="text-sm max-w-xl leading-normal wrap-break-word text-center opacity-80">
          {description}
        </div>
      )}
    </div>
  );
}
