import { defineConfig } from "tsdown";
import Vue from "unplugin-vue/rolldown"; // for .vue compilation

export default defineConfig({
  plugins: [Vue({ isProduction: true })],
  dts: {
    vue: true, // so that vue-tsc generates declarations for generic SFCs
  },
  deps: {
    neverBundle: ["vue"], // so that vue stays external
  },
});
