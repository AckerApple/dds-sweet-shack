import { tagElement } from "taggedjs";
import { ContactApp } from "./views/ContactApp.tag.js";
import "./styles/site.css";

const root = document.getElementById("app");

if (root) {
  tagElement(ContactApp, root);
}
