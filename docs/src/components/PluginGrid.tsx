import { getAllPluginMetadata, type AdapterId } from "@jsoc/grid-docs";
import { getPluginIcon } from "@/icons/plugins";
import { PackageCardGrid } from "@/components/PackageCardGrid";

type Props = {
  adapterId: AdapterId;
};

export function PluginGrid({ adapterId }: Props) {
  const plugins = getAllPluginMetadata(adapterId);

  return (
    <PackageCardGrid>
      {plugins.map(({ id, name, packageName }) => {
        const Icon = getPluginIcon(adapterId, id);

        return (
          <PackageCardGrid.Card
            key={id}
            title={name}
            packageName={packageName}
            icon={<Icon />}
            mainLink={`/docs/plugins/${adapterId}-${id}`}
            githubLink={`https://github.com/jsoc-dev/grid/tree/main/packages/${adapterId}-plugins/${adapterId}-${id}`}
          />
        );
      })}
    </PackageCardGrid>
  );
}
