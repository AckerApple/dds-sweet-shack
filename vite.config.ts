import { defineConfig } from "vite";
import { resolve } from "node:path";

export default defineConfig({
  base: "./",
  build: {
    outDir: "dist",
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        customOrder: resolve(__dirname, "custom-order.html"),
        contact: resolve(__dirname, "contact.html"),
        orderDetails: resolve(__dirname, "order-details.html"),
        productDetails: resolve(__dirname, "product-details.html"),
        adminProducts: resolve(__dirname, "admin-products.html"),
      },
      output: {
        manualChunks(id) {
          if (id.includes("/web/taggedjs/") || id.includes("/node_modules/taggedjs/")) {
            return "taggedjs";
          }
        },
      },
    },
  },
});
