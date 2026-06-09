import type {
  VanillaGridExampleIds,
  VanillaGridPluginId,
} from "@jsoc/grid-docs";

/**
 * Options required for mounting the examples router.
 */
export type ExamplesRouterOptions<P extends VanillaGridPluginId> = {
  root: HTMLElement;
  pluginId: P;
  components: Record<VanillaGridExampleIds<P>, ExampleComponent>;
};

/**
 * An example component is called for rendering by the router when its associated
 * example ID in the {@link ExamplesRouterOptions.components} matches with the example ID
 * in the URL search params.
 */
export type ExampleComponent = (root: HTMLElement) => void;

/**
 * A function that destroys the subscriptions or listeners created by the {@link ExamplesRouter}
 * or its associated {@link ExampleComponent}s.
 */
export type UnmountExamplesRouter = () => void;
