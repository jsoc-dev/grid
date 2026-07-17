import { CodeBlock } from "@/components/CodeBlock";
import { getDynamicContentScope } from "@/utils/dynamicContentScope";
import { getPackageJson } from "@/utils/getPackageJson";

type Props = {
  of?: "adapter" | "plugin";
};

export function PeerDepsBlock({ of = "plugin" }: Props) {
  const scope = getDynamicContentScope();

  if (!scope) return null;

  const { plugin, adapter } = scope;

  let packageJson;
  if (of === "plugin") {
    packageJson = getPackageJson(adapter.id, plugin.id);
  } else {
    packageJson = getPackageJson(adapter.id);
  }

  const peerDeps = JSON.stringify(packageJson?.peerDependencies || {}, null, 2);
  const code = `"peerDependencies": ` + peerDeps;

  return <CodeBlock code={code} lang="json" />;
}
