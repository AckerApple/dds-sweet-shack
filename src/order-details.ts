import { tagElement } from "taggedjs";
import { OrderDetailsApp } from "./views/OrderDetailsApp.tag.js";
import "./styles/site.css";

const root = document.getElementById("app");

if (root) {
  tagElement(OrderDetailsApp, root);
}
