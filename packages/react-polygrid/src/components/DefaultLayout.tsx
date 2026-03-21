import { Navigator } from "#components/navigator/index.ts";
import type { GridLayoutProps } from "#PolyGrid.tsx";

import { useStoreContext } from "@jsoc/react-grid";

// For consumers who want to use the Default Layout component but with custom options
export type DefaultLayoutOptions = {
  navigator?: {
    hideNavWhenSingleSchema?: boolean;
  };
};

export type DefaultLayoutProps = GridLayoutProps & {
  options?: DefaultLayoutOptions;
};

/**
 * Default layout component used by `PolyGrid`.
 * - If you want to use the default layout with custom options, then you will need to
 * create a custom layout in which you can render the default layout with desired options.
 *
 * NOTE: `PolyGrid` component doesn't call `DefaultLayout` with options prop as it respects the
 * `GridLayoutProps` type.
 */
export function DefaultLayout({ children, options }: DefaultLayoutProps) {
  const { gridStore } = useStoreContext();
  const hideNavWhenSingleSchema =
    options?.navigator?.hideNavWhenSingleSchema ?? true;
  const showNav =
    gridStore.getSchemas().length > 1 ? true : !hideNavWhenSingleSchema;
  const navHeight = showNav ? "48px" : "0px";

  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {showNav && (
        <div style={{ height: navHeight }}>
          <Navigator />
        </div>
      )}
      <div style={{ flex: 1, maxHeight: `calc(100% - ${navHeight})` }}>
        {children}
      </div>
    </div>
  );
}
