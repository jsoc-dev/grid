"use client";

import {
  getAdapterIds,
  getAdapterMetadata,
  getUpcomingAdapterIds,
} from "@jsoc/grid-docs";
import CardGrid from "@/components/CardGrid";
import { getAdapterIcon } from "@/icons/adapters";
import type { SvgIcon } from "@/types/svg";
import { useExamplesNavigator } from "@/hooks/useExamplesNavigator";
import { toPascalCase } from "@jsoc/utils";

function renderIcon(Icon: SvgIcon) {
  return <Icon className="w-12 h-12" />;
}

export function ChooseAdapter() {
  const navigate = useExamplesNavigator();

  const supportedAdapters = getAdapterIds().map((adapterId) => {
    const adapterMetadata = getAdapterMetadata(adapterId);

    return {
      label: adapterMetadata.frameworkName,
      icon: renderIcon(getAdapterIcon(adapterId)),
      onClick: () => navigate([adapterId]),
    };
  });

  const upcomingAdapters = getUpcomingAdapterIds().map((adapterId) => {
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
