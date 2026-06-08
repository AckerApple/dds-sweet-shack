import productsJson from "../../public/assets/creations/product_images/products.json";
import type { CreationCategory, CreationItem } from "./creations.js";

export type ProductCatalogItem = {
  productCode: string;
  title: string;
  category: CreationCategory;
  description: string;
  imageName: string;
  imagePath: string;
  altText: string;
  suggestedUnit: string;
  tags: string[];
  updatedAt?: string;
  featured?: boolean;
};

export const products = productsJson as ProductCatalogItem[];

export const productByCode = new Map(
  products.map((product) => [product.productCode, product])
);

export const productToCreation = (product: ProductCatalogItem): CreationItem => ({
  id: product.productCode,
  productCode: product.productCode,
  title: product.title,
  category: product.category,
  description: product.description,
  image: product.imagePath,
  altText: product.altText,
  featured: product.featured,
});
