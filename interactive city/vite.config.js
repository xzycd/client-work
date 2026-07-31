import { defineConfig } from "vite";

export default defineConfig({
  build: {
    // Keep the deployable experience entirely text-based for direct static uploads.
    // This also prevents a missing font asset from changing the editorial typography.
    assetsInlineLimit: 100_000,
  },
});
