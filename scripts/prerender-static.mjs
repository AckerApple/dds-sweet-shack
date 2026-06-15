import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createServer } from "vite";
import { elementVarToHtmlString } from "taggedjs";

const rootDir = resolve(fileURLToPath(new URL("..", import.meta.url)));
const outDir = resolve(rootDir, process.argv[2] || "dist");

const pages = [
  {
    file: "index.html",
    module: "/src/views/HomeApp.tag.ts",
    exportName: "renderHomeApp",
  },
  {
    file: "custom-order.html",
    module: "/src/views/CustomOrderApp.tag.ts",
    exportName: "renderCustomOrderApp",
  },
  {
    file: "contact.html",
    module: "/src/views/ContactApp.tag.ts",
    exportName: "renderContactApp",
  },
  {
    file: "product-details.html",
    module: "/src/views/ProductDetailsApp.tag.ts",
    exportName: "renderProductDetailsApp",
  },
  {
    file: "order-details.html",
    module: "/src/views/OrderDetailsApp.tag.ts",
    exportName: "renderOrderDetailsApp",
  },
];

const renderHtml = (value) => elementVarToHtmlString(value);

const normalizeRelativeUrls = (html) =>
  html
    .replace(/\b(href|src)="\/(?!\/)/g, '$1="./')
    .replace(/url\(&quot;\/(?!\/)/g, "url(&quot;./");

const injectStaticHtml = (documentHtml, staticHtml) => {
  const appPattern = /<div id="app"><\/div>/;
  if (!appPattern.test(documentHtml)) {
    throw new Error("Could not find empty #app root in built HTML.");
  }

  return documentHtml.replace(appPattern, `<div id="app">${staticHtml}</div>`);
};

const server = await createServer({
  root: rootDir,
  appType: "custom",
  logLevel: "silent",
  server: {
    hmr: false,
    middlewareMode: true,
  },
});

try {
  for (const page of pages) {
    const pagePath = resolve(outDir, page.file);
    const pageModule = await server.ssrLoadModule(page.module);
    const renderPage = pageModule[page.exportName];

    if (typeof renderPage !== "function") {
      throw new Error(`Missing ${page.exportName} export from ${page.module}.`);
    }

    const documentHtml = await readFile(pagePath, "utf8");
    const staticHtml = normalizeRelativeUrls(renderHtml(renderPage()));
    await writeFile(pagePath, injectStaticHtml(documentHtml, staticHtml));
    console.log(`Prerendered ${page.file} (${staticHtml.length} bytes)`);
  }
} finally {
  await server.close();
}
