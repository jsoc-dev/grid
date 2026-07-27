import { CodeBlock } from "@/components/CodeBlock";
import { ApiDoc } from "@/components/api/api-doc";
import { getMDXComponents } from "@/mdx-components";
import { DeclarationKind } from "@/utils/api/api-declaration";
import {
  isResolvedApiExport,
  getModuleSpecifierRelativeToRoot,
} from "@/utils/api/api-exports";
import { withPackageLink, withPackageScope } from "@/utils/api/api-packages";
import type {
  ApiExport,
  GenerateDefinitionResult,
  ResolvedApiExport,
} from "@/utils/api/api-reference-types";
import {
  getPageTitleSuffix,
  getSpecificationTitle,
} from "@/utils/api/create-raw-mdx-for-api";
import {
  withGithubMainBranchUrl,
  withPackageGithubBaseUrl,
} from "@jsoc/grid-docs";
import type { Heading } from "nextra";
import { Callout } from "nextra/components";
import type { ReactNode } from "react";

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
  apiExport: ResolvedApiExport,
  definition: GenerateDefinitionResult | undefined,
): GenerateApiPageResult {
  const { declaration } = apiExport;
  const toc: Heading[] = [];
  const sections: ReactNode[] = [];

  // Declaration section (only for type aliases/interfaces)
  if (declaration.kind === DeclarationKind.Type) {
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
    const specTitle = getSpecificationTitle(declaration, definition);
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
        <SourceCodeCallout apiExport={apiExport} />
        {sections}
      </>
    ),
  };
}

function Title({ apiExport }: { apiExport: ApiExport }) {
  const { name: exportName, declaration } = apiExport;
  const suffix = getPageTitleSuffix(declaration);

  return (
    <H1>
      <Code>{exportName}</Code>
      {isResolvedApiExport(apiExport) && " " + suffix}
    </H1>
  );
}

function SourceCodeCallout({ apiExport }: { apiExport: ResolvedApiExport }) {
  const { packageName, declaration } = apiExport;
  const sourceCodeUrl = withGithubMainBranchUrl(
    getModuleSpecifierRelativeToRoot(declaration),
  );

  const packageNameWithScope = withPackageScope(packageName);
  const packageLink = withPackageLink(packageName);

  return (
    <Callout type="default">
      This API reference is automatically generated from the{" "}
      <Anchor href={sourceCodeUrl}>source code</Anchor> of the{" "}
      <Anchor href={packageLink}>{packageNameWithScope}</Anchor> package.
    </Callout>
  );
}

export function UnresolvedApiPage({ apiExport }: { apiExport: ApiExport }) {
  const sourceCodeUrl = withPackageGithubBaseUrl(apiExport.packageName);

  return (
    <>
      <Title apiExport={apiExport} />
      <Paragraph>
        We are still working on this page. Please check back later. In the
        meantime, you can explore the{" "}
        <Anchor href={sourceCodeUrl}>source code</Anchor> of its package.
      </Paragraph>
    </>
  );
}

export const renderUnresolvedApiPage = (apiExport: ApiExport) => (
  <UnresolvedApiPage apiExport={apiExport} />
);
