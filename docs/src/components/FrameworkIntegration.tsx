import { Integration, type IntegrationItem } from "@/components/Integration";
import { getAdapterIcon } from "@/icons/adapters";
import { getAdapterMetadata, type AdapterId } from "@jsoc/grid-docs";
import { Blocks as GridCoreIcon } from "lucide-react";

type Props = {
  adapterId: AdapterId;
};

export const GRID_CORE_INTEGRATION_ITEM = {
  Icon: GridCoreIcon,
  iconProps: { strokeWidth: 1.5, className: "text-accent-500" },
  label: "Core",
};

export function getAdapterIntegrationItem(adapterId: AdapterId): IntegrationItem {
  const FrameworkIcon = getAdapterIcon(adapterId);
  const { frameworkName } = getAdapterMetadata(adapterId);
  return {
    Icon: FrameworkIcon,
    iconProps: { className: "p-1.5" },
    label: frameworkName,
  };
}

export function FrameworkIntegration({ adapterId }: Props) {
  return (
    <Integration
      items={[GRID_CORE_INTEGRATION_ITEM, getAdapterIntegrationItem(adapterId)]}
    />
  );
}
