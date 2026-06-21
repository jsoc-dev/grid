export type PageSearchParams = Awaited<
  PageProps<"/docs/[[...mdxPath]]">["searchParams"]
>;
