import { button, tag } from "taggedjs";
import type { CreationItem } from "../data/creations.js";

type ProductRequestButtonOptions = {
  creation: CreationItem;
  onRequest: (creation: CreationItem) => void;
  className?: string;
};

export const ProductRequestButton = tag((input: ProductRequestButtonOptions) => {
  let props = input;
  ProductRequestButton.inputs(([next]) => {
    props = next;
  });

  return button
    .class(() => props.className || "primary-button")
    .type("button")
    .onClick(() => props.onRequest(props.creation))("I Want This");
});
