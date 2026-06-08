import { tagElement } from "taggedjs";
import { AdminProductsApp } from "./views/AdminProductsApp.tag.js";
import "./styles/site.css";

const root = document.getElementById("app");

if (root) {
  tagElement(AdminProductsApp, root);
}
