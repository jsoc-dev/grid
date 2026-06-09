"use client";

import {
  getAdapterIds,
  getAdapterMetadata,
  type UpcomingAdapterId,
} from "@jsoc/grid-docs";
import { useExamplesNavigator } from "@/hooks/useExamplesNavigator";
import CardGrid from "@/components/generic/CardGrid";
import { toPascalCase } from "@jsoc/utils";
import { getAdapterIcon } from "@/assets/icons/adapters";
import type { SvgIcon } from "@/types/svg";

function renderIcon(Icon: SvgIcon) {
  return <Icon className="w-12 h-12" />;
}

const UPCOMING_ADAPTER_IDS = [
  "angular-grid",
] as const satisfies UpcomingAdapterId[];

export function ChooseAdapter() {
  const navigateToExample = useExamplesNavigator();

  const supportedAdapters = getAdapterIds().map((adapterId) => {
    const adapterMetadata = getAdapterMetadata(adapterId);

    return {
      label: adapterMetadata.name,
      icon: renderIcon(getAdapterIcon(adapterId)),
      onClick: () => navigateToExample([adapterId]),
    };
  });

  const upcomingAdapters = UPCOMING_ADAPTER_IDS.map((adapterId) => {
    return {
      label: toPascalCase(adapterId.replaceAll("-grid", "")),
      icon: renderIcon(getAdapterIcon(adapterId)),
      disabled: true,
      badge: "Coming soon",
    };
  });

  return (
    <div className="flex flex-col py-12 gap-12 w-full items-center">
      <h1 className="text-2xl font-semibold">Choose a framework</h1>
      <CardGrid cards={[...supportedAdapters, ...upcomingAdapters]} />
    </div>
  );
}
