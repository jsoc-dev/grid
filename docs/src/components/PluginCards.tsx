import {
  getAllPluginMetadata,
  withPackageGithubBaseUrl,
  type AdapterId,
  type PluginId,
} from "@jsoc/grid-docs";
import { getPluginIcon } from "@/icons/plugins";
import { PackageCards } from "@/components/PackageCards";

type Props<A extends AdapterId> = {
  adapterId: A;
  centered?: boolean;
  mainLink: string | ((pluginId: PluginId<A>) => string);
  hideMetadata?: boolean;
};

export function PluginCards<A extends AdapterId>({
  adapterId,
  centered,
  mainLink,
  hideMetadata,
}: Props<A>) {
  const plugins = getAllPluginMetadata(adapterId);

  return (
    <PackageCards centered={centered}>
      {plugins.map(({ id, name, packageName }) => {
        const Icon = getPluginIcon(adapterId, id);

        return (
          <PackageCards.Card
            id={id as PluginId<A>}
            key={id}
            title={name}
            packageName={hideMetadata ? undefined : packageName}
            icon={<Icon />}
            mainLink={mainLink}
            githubLink={
              hideMetadata
                ? undefined
                : withPackageGithubBaseUrl(
                    `${adapterId}-plugins/${adapterId}-${id}`,
                  )
            }
          />
        );
      })}
    </PackageCards>
  );
}
