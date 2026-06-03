export type CreationCategory =
  | "Cakes"
  | "Cupcakes"
  | "Treats"
  | "Cookies"
  | "Party Favors"
  | "Seasonal";

export type CreationItem = {
  id: string;
  productCode?: string;
  title: string;
  category: CreationCategory;
  description: string;
  image: string;
  fallbackImage?: string;
  altText?: string;
  featured?: boolean;
};

export const creationCategories: CreationCategory[] = [
  "Cakes",
  "Cupcakes",
  "Treats",
  "Cookies",
  "Party Favors",
  "Seasonal",
];

import { productToCreation, products } from "./products.js";

export const creations: CreationItem[] = products.map(productToCreation);
