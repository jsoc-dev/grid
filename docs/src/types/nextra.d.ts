import "next";

declare module "next" {
  interface Metadata {
    /**
     * This property is used to indicate whether the page contains dynamic content that requires re-compiling
     * on the server side.
     */
    dynamicContent?: boolean;
  }
}
