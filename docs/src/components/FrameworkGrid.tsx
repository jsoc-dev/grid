import { getAllAdapterMetadata } from "@jsoc/grid-docs";
import { getAdapterIcon } from "@/icons/adapters";
import { PackageCardGrid } from "@/components/PackageCardGrid";

export async function FrameworkGrid() {
  const adapters = getAllAdapterMetadata();

  return (
    <PackageCardGrid>
      {adapters.map(({ id, frameworkName, packageName }) => {
        const Icon = getAdapterIcon(id);

        return (
          <PackageCardGrid.Card
            key={id}
            title={frameworkName}
            packageName={packageName}
            icon={<Icon />}
            mainLink={`/docs/adapters/${id}`}
            githubLink={`https://github.com/jsoc-dev/grid/tree/main/packages/${id}`}
          />
        );
      })}
    </PackageCardGrid>
  );
}
