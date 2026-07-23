declare module "*.svg" {
  import type { FC, SVGProps } from "react";
  const SVG: FC<SVGProps<SVGSVGElement>>;

  export default SVG;
}
import type { FC, SVGProps } from "react";
export type SvgIcon = FC<SVGProps<SVGSVGElement>>;
