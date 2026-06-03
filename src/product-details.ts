import { tagElement } from "taggedjs";
import { ProductDetailsApp } from "./views/ProductDetailsApp.tag.js";
import "./styles/site.css";

const root = document.getElementById("app");

if (root) {
  tagElement(ProductDetailsApp, root);
}
