import { CodeBlock } from "@/components/CodeBlock";
import { ApiDoc } from "@/components/api/api-doc";
import { getMDXComponents } from "@/mdx-components";
import { getModuleSpecifierRelativeToRoot } from "@/utils/api/api-exports";
import { withPackageScope } from "@/utils/api/api-packages";
import type {
  ApiExport,
  GenerateDefinitionResult,
} from "@/utils/api/api-reference-types";
import {
  withGithubMainBranchUrl,
  withPackageGithubBaseUrl,
} from "@jsoc/grid-docs";
import type { Heading } from "nextra";
import { Callout } from "nextra/components";
import type { ReactNode } from "react";
import type { ExportedDeclarations } from "ts-morph";

export type GenerateApiPageResult = {
  toc: Heading[];
  content: ReactNode;
};

const {
  a: Anchor,
  code: Code,
  details: Details,
  h1: H1,
  h2: H2,
  p: Paragraph,
  summary: Summary,
} = getMDXComponents();

/**
 * (experimental) React components based API page generator introduced to replace
 * the [raw mdx to page generator](../../utils/api/generate-api-page.ts).
 *
 * There are several downsides of using this:
 * 1. Markdown formatting symbols will render as it is. For example: If the
 *    description contains text like \`foo\`, it will render exactly as \`foo\`
 *    instead of `foo` (with a monospace font and styled like code).
 * 2. Copy as Markdown option will not be available.
 * 3. Table of contents needs to be built manually.
 */
export function generateApiPage(
  apiExport: ApiExport,
  definition: GenerateDefinitionResult | undefined,
): GenerateApiPageResult {
  const { packageName, declaration } = apiExport;

  if (!declaration) {
    const sourceCodeUrl = withPackageGithubBaseUrl(packageName);

    return {
      toc: [],
      content: (
        <>
          <Title apiExport={apiExport} />
          <Paragraph>
            We are still working on this page. Please check back later. In the
            meantime, you can explore the{" "}
            <Anchor href={sourceCodeUrl}>source code</Anchor> of its package.
          </Paragraph>{" "}
        </>
      ),
    };
  }

  const toc: Heading[] = [];
  const sections: ReactNode[] = [];

  const { isClass, isFunction, isType, isOther } = apiExport.declarationKind;

  // Declaration (only for type aliases/interfaces)
  if (isType) {
    const declarationCode = (
      <CodeBlock code={declaration.getText()} lang="typescript" />
    );

    const sectionKey = "declaration";
    const sectionName = "Declaration";

    if (definition) {
      sections.push(
        <Details key={sectionKey}>
          <Summary>View {sectionName}</Summary>
          {declarationCode}
        </Details>,
      );
    } else {
      toc.push({ depth: 2, value: sectionName, id: sectionKey });
      sections.push(
        <section key={sectionKey}>
          <H2 id={sectionKey}>{sectionName}</H2>
          {declarationCode}
        </section>,
      );
    }
  }

  if (definition) {
    // Specification
    const specTitle = isClass
      ? "Members"
      : isFunction
        ? "Signature"
        : isType
          ? "Fields"
          : isOther && definition
            ? "signatures" in definition
              ? "Signature"
              : "Properties"
            : "Properties";
    const specId = specTitle.toLowerCase();

    toc.push({ depth: 2, value: specTitle, id: specId });
    sections.push(
      <section key="specification">
        <H2 id={specId}>{specTitle}</H2>
        <ApiDoc definition={definition} />
      </section>,
    );

    // Throws
    if (definition.tags?.throws) {
      sections.push(
        <Callout key="throws" type="warning">
          {definition.tags.throws}
        </Callout>,
      );
    }

    // see also
    if (definition.tags?.see) {
      const sectionId = "see-also";
      const sectionTitle = "See also";
      toc.push({ depth: 2, value: sectionTitle, id: sectionId });
      sections.push(
        <section key={sectionId}>
          <H2 id={sectionId}>{sectionTitle}</H2>
          <Paragraph>{definition.tags.see}</Paragraph>
        </section>,
      );
    }

    // Example
    if (definition.tags?.example) {
      toc.push({ depth: 2, value: "Example", id: "example" });
      sections.push(
        <section key="example">
          <H2 id="example">Example</H2>
          <Paragraph>{definition.tags.example}</Paragraph>
        </section>,
      );
    }

    // Usage
    if (definition.tags?.usage) {
      toc.push({ depth: 2, value: "Usage", id: "usage" });
      sections.push(
        <section key="usage">
          <H2 id="usage">Usage</H2>
          <Paragraph>{definition.tags.usage}</Paragraph>
        </section>,
      );
    }
  }

  return {
    toc,
    content: (
      <>
        <Title apiExport={apiExport} />
        {definition?.description && (
          <Paragraph>{definition.description}</Paragraph>
        )}
        <SourceCodeCallout apiExport={apiExport} declaration={declaration} />
        {sections}
      </>
    ),
  };
}

function Title({ apiExport }: { apiExport: ApiExport }) {
  const { name: exportName, declaration } = apiExport;
  const { isClass, isFunction, isType } = apiExport.declarationKind;

  const suffix = isClass
    ? "class"
    : isFunction
      ? "function"
      : isType
        ? "type"
        : ""; // can be a primitive or a re-export of a class/function/type.

  return (
    <H1>
      <Code>{exportName}</Code>
      {declaration && " " + suffix}
    </H1>
  );
}

function SourceCodeCallout({
  apiExport,
  declaration,
}: {
  apiExport: ApiExport;
  declaration: ExportedDeclarations;
}) {
  const { packageName } = apiExport;
  const sourceCodeUrl = withGithubMainBranchUrl(
    getModuleSpecifierRelativeToRoot(declaration),
  );

  const packageNameWithScope = withPackageScope(packageName);
  const packageLink = `https://www.npmjs.com/package/${packageNameWithScope}`;

  return (
    <Callout type="default">
      This API reference is automatically generated from the{" "}
      <Anchor href={sourceCodeUrl}>source code</Anchor> of the{" "}
      <Anchor href={packageLink}>{packageNameWithScope}</Anchor> package.
    </Callout>
  );
}
