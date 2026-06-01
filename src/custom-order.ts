import { tagElement } from "taggedjs";
import { CustomOrderApp } from "./views/CustomOrderApp.tag.js";
import "./styles/site.css";

const root = document.getElementById("app");

if (root) {
  tagElement(CustomOrderApp, root);
}
