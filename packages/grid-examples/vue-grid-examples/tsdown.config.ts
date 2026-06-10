import { defineConfig } from "tsdown";
import Vue from "unplugin-vue/rolldown";

export default defineConfig({
  plugins: [Vue({ isProduction: true })],
  dts: { vue: true },
  deps: {
    neverBundle: ["vue"],
  },
});
