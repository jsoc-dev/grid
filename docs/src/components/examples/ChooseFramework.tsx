"use client";

import { getFrameworkIds, getFrameworkMetadata } from "@jsoc/grid-docs";
import { useExamplesNavigator } from "@/hooks/useExamplesNavigator";
import CardGrid from "@/components/generic/CardGrid";
import { toPascalCase } from "@jsoc/utils";
import { getFrameworkIcon } from "@/assets/icons/frameworks";
import type { SvgIcon } from "@/types/svg";

function renderIcon(Icon: SvgIcon) {
  return <Icon className="w-12 h-12" />;
}

const UPCOMING_FRAMEWORK_IDS = ["angular-grid"] as const;

export function ChooseFramework() {
  const navigateToExample = useExamplesNavigator();

  const supportedFrameworks = getFrameworkIds().map((frameworkId) => {
    const frameworkMetadata = getFrameworkMetadata(frameworkId);

    return {
      label: frameworkMetadata.name,
      icon: renderIcon(getFrameworkIcon(frameworkId)),
      onClick: () => navigateToExample([frameworkId]),
    };
  });

  const upcomingFrameworks = UPCOMING_FRAMEWORK_IDS.map((frameworkId) => {
    return {
      label: toPascalCase(frameworkId.replaceAll("-grid", "")),
      icon: renderIcon(getFrameworkIcon(frameworkId)),
      disabled: true,
      badge: "Coming soon",
    };
  });

  return (
    <div className="flex flex-col py-12 gap-12 w-full items-center">
      <h1 className="text-2xl font-semibold">Choose a framework</h1>
      <CardGrid cards={[...supportedFrameworks, ...upcomingFrameworks]} />
    </div>
  );
}
