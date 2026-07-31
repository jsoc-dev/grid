import { CodeBlock } from "@/components/CodeBlock";
import { getDynamicContentScope } from "@/utils/dynamicContentScope";
import { getPackageMetadata } from "@/artifacts/get-package-metadata";

type Props = {
  of?: "adapter" | "plugin";
};

export function PeerDepsBlock({ of = "plugin" }: Props) {
  const scope = getDynamicContentScope();

  if (!scope) return null;

  const { plugin, adapter } = scope;

  const packageMeta = getPackageMetadata(
    adapter.id,
    of === "plugin" ? plugin.id : undefined,
  );
  const peerDeps = JSON.stringify(packageMeta.peerDependencies, null, 2);
  const code = `"peerDependencies": ` + peerDeps;

  return <CodeBlock code={code} lang="json" />;
}
