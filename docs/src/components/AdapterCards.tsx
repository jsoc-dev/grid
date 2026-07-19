import {
  getAllAdapterMetadata,
  getUpcomingAdapterIds,
  type AdapterId,
} from "@jsoc/grid-docs";
import { getAdapterIcon } from "@/icons/adapters";
import { PackageCards } from "@/components/PackageCards";
import { toPascalCase } from "@jsoc/utils";

type AdapterCardsProps = {
  showUpcoming?: boolean;
  mainLink: string | ((adapterId: AdapterId) => string);
  hideMetadata?: boolean;
};

export function AdapterCards({
  showUpcoming,
  mainLink,
  hideMetadata,
}: AdapterCardsProps) {
  const adapters = getAllAdapterMetadata();
  const upcomingIds = showUpcoming ? getUpcomingAdapterIds() : [];

  return (
    <PackageCards>
      {adapters.map(({ id, frameworkName, packageName }) => {
        const Icon = getAdapterIcon(id);

        return (
          <PackageCards.Card
            id={id}
            key={id}
            title={frameworkName}
            packageName={hideMetadata ? undefined : packageName}
            icon={<Icon />}
            mainLink={mainLink}
            githubLink={
              hideMetadata
                ? undefined
                : `https://github.com/jsoc-dev/grid/tree/main/packages/${id}`
            }
          />
        );
      })}

      {upcomingIds.map((id) => {
        const Icon = getAdapterIcon(id);

        return (
          <PackageCards.Card
            id={id}
            key={id}
            title={toPascalCase(id.replaceAll("-grid", ""))}
            packageName=""
            icon={<Icon />}
            disabled
            badge="Coming soon"
          />
        );
      })}
    </PackageCards>
  );
}
