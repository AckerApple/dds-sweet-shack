import { existsSync } from "node:fs";
import { readdir, readFile, writeFile } from "node:fs/promises";
import { extname, join, parse } from "node:path";

const productImageDir = "assets/creations/product_images";
const catalogPath = join(productImageDir, "products.json");
const supportedExtensions = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif"]);
const shouldAddMissing = process.argv.includes("--add-missing");

const titleFromProductCode = (productCode) =>
  productCode
    .replace(/_\d+_n$/, "")
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());

const imageFiles = (await readdir(productImageDir))
  .filter((fileName) => supportedExtensions.has(extname(fileName).toLowerCase()))
  .sort();

const catalog = JSON.parse(await readFile(catalogPath, "utf8"));
const catalogImageNames = new Set(catalog.map((product) => product.imageName));
const catalogProductCodes = new Set(catalog.map((product) => product.productCode));

const missingCatalogEntries = imageFiles.filter((fileName) => !catalogImageNames.has(fileName));
const missingImageFiles = catalog.filter((product) => !existsSync(join(productImageDir, product.imageName)));
const duplicateProductCodes = catalog
  .map((product) => product.productCode)
  .filter((productCode, index, allCodes) => allCodes.indexOf(productCode) !== index);

if (shouldAddMissing && missingCatalogEntries.length) {
  for (const imageName of missingCatalogEntries) {
    const productCode = parse(imageName).name;
    if (catalogProductCodes.has(productCode)) {
      continue;
    }

    catalog.push({
      productCode,
      title: titleFromProductCode(productCode),
      category: "Treats",
      description: "TODO: Add product description.",
      imageName,
      imagePath: `/assets/creations/product_images/${imageName}`,
      altText: "TODO: Add image alt text.",
      suggestedUnit: "each",
      tags: ["TODO"],
    });
  }

  catalog.sort((a, b) => a.productCode.localeCompare(b.productCode));
  await writeFile(catalogPath, `${JSON.stringify(catalog, null, 2)}\n`);
}

const result = {
  imageCount: imageFiles.length,
  productCount: catalog.length,
  missingCatalogEntries,
  missingImageFiles: missingImageFiles.map((product) => product.imageName),
  duplicateProductCodes: [...new Set(duplicateProductCodes)],
};

console.log(JSON.stringify(result, null, 2));

if (
  result.missingCatalogEntries.length ||
  result.missingImageFiles.length ||
  result.duplicateProductCodes.length
) {
  process.exitCode = shouldAddMissing ? 0 : 1;
}
