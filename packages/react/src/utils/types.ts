import { FC } from "react";

export type ExtractProps<C> = C extends FC<infer P> ? P : never;
