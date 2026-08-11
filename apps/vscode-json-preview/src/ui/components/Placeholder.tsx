import infoIconSvg from "@vscode/codicons/src/icons/info.svg";
import warningIconSvg from "@vscode/codicons/src/icons/warning.svg";
import errorIconSvg from "@vscode/codicons/src/icons/error.svg";
import "./Placeholder.css";

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

export function Placeholder({ type, title, description }: PlaceholderProps) {
  const iconSvg = ICONS[type];

  return (
    <div className={`placeholder-container placeholder--${type}`}>
      <div
        className="placeholder-icon"
        dangerouslySetInnerHTML={{ __html: iconSvg }}
      />
      <div className="placeholder-title">{title}</div>
      {description && (
        <div className="placeholder-description">{description}</div>
      )}
    </div>
  );
}
