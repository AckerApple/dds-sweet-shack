import { a, button, div, h3, p, section, span, tag } from "taggedjs";
import { creationCategories, creations, type CreationCategory, type CreationItem } from "../data/creations.js";

type GalleryOptions = {
  selectedCategory: CreationCategory | "All";
  onSelectCategory: (category: CreationCategory | "All") => void;
  onRequest: (creation: CreationItem) => void;
};

const assetPath = (path: string) => {
  const cleanPath = path.replace(/^\/+/, "");
  return `${import.meta.env.BASE_URL}${cleanPath}`;
};

const imageStack = (creation: CreationItem) => {
  const urls = [creation.image, creation.fallbackImage]
    .filter(Boolean)
    .map((path) => `url("${assetPath(path as string).replace(/"/g, "%22")}")`);
  return `background-image: ${urls.join(", ")};`;
};

const visibleCreations = (selectedCategory: CreationCategory | "All") =>
  selectedCategory === "All"
    ? creations
    : creations.filter((creation) => creation.category === selectedCategory);

const productDetailsHref = (creation: CreationItem) =>
  `${import.meta.env.BASE_URL}product-details.html?product=${encodeURIComponent(creation.productCode || creation.id)}`;

export const Gallery = tag((input: GalleryOptions) => {
  let props = input;
  Gallery.inputs(([next]) => {
    props = next;
  });

  return section.class`section gallery-section`.id("creations")(
    div.class`section-heading`(
      span.class`section-kicker`("Creations"),
      h3("Pick a sweet starting point"),
      p("Choose a design you like, then send a quick request. Pricing and final details are confirmed after contact.")
    ),
    div.class`filter-row`.attr("aria-label", "Creation categories")(
      (["All", ...creationCategories] as Array<CreationCategory | "All">).map((category) =>
        button
          .class(() => category === props.selectedCategory ? "filter-chip filter-chip-active" : "filter-chip")
          .type("button")
          .attr("aria-pressed", () => category === props.selectedCategory ? "true" : "false")
          .onClick(() => props.onSelectCategory(category))(category)
      )
    ),
    div.class`creation-grid`(
      () => visibleCreations(props.selectedCategory).map((creation) =>
        div.class`creation-card`(
          a
            .class`creation-image-wrap creation-image`
            .href(productDetailsHref(creation))
            .style(imageStack(creation))
            .attr("role", "img")
            .attr("aria-label", `View details for ${creation.title}`)(),
          div.class`creation-body`(
            span.class`category-label`(creation.category),
            h3(creation.title),
            p(creation.description),
            button.class`card-button`.type("button").onClick(() => props.onRequest(creation))("I Want This")
          )
        )
      )
    )
  );
});
