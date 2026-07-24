import type { SvgIcon } from "@/types/svg";
import clsx from "clsx";
import type { ComponentProps } from "react";
import { Fragment } from "react/jsx-runtime";

export type IntegrationItem = {
  Icon: SvgIcon;
  iconProps?: ComponentProps<SvgIcon>;
  label: string;
};

export enum IntegrationSymbol {
  Plus = "+",
  Cross = "×",
  Dot = "•",
}

type Props = {
  items: IntegrationItem[];
  integrationSymbol?: IntegrationSymbol;
};

export function Integration({
  items,
  integrationSymbol = IntegrationSymbol.Plus,
}: Props) {
  return (
    <div className="flex items-center gap-10 mt-6 mb-12">
      {items.map((item, index) => (
        <Fragment key={item.label}>
          {index > 0 && <Integrator symbol={integrationSymbol} />}
          <IntegrationItem {...item} />
        </Fragment>
      ))}
    </div>
  );
}

function IntegrationItem({ Icon, label, iconProps }: IntegrationItem) {
  return (
    <div className="flex flex-col items-center gap-2">
      <Icon
        {...iconProps}
        className={clsx("w-32 h-32", iconProps?.className)}
      />
      <span className="font-bold">{label}</span>
    </div>
  );
}

function Integrator({ symbol }: { symbol: IntegrationSymbol }) {
  return <span className="text-zinc-400 font-bold text-6xl">{symbol}</span>;
}
