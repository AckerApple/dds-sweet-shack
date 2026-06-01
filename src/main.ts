import { tagElement } from "taggedjs";
import { HomeApp } from "./views/HomeApp.tag.js";
import "./styles/site.css";

const root = document.getElementById("app");

if (root) {
  tagElement(HomeApp, root);
}
