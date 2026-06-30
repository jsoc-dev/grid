import "server-only";
import { cache } from "react";
import { extractSnippetsFromManifest } from "@jsoc/grid-docs";

export const getCachedSnippetMap = cache(extractSnippetsFromManifest);
