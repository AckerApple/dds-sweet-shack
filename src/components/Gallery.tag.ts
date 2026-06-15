import { a, button, div, h3, label, option, p, section, select, tag } from "taggedjs";
import { ProductRequestButton } from "./ProductActions.tag.js";
import { creationCategories, creations, type CreationCategory, type CreationItem } from "../data/creations.js";

export type CakeSubcategory = "All Cakes" | "Traditional" | "Burn Cakes" | "Jar Cakes";

type GalleryOptions = {
  selectedCategory: CreationCategory | "All";
  selectedCakeSubcategory: CakeSubcategory;
  currentPage: number;
  onSelectCategory: (category: CreationCategory | "All") => void;
  onSelectCakeSubcategory: (subcategory: CakeSubcategory) => void;
  onSelectPage: (page: number) => void;
  onRequest: (creation: CreationItem) => void;
};

const cakeSubcategories: CakeSubcategory[] = ["All Cakes", "Traditional", "Burn Cakes", "Jar Cakes"];

const filterCategories: Array<CreationCategory | "All"> = [...creationCategories, "All"];

const pageSize = 12;

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

const productDetailsHref = (creation: CreationItem) =>
  `${import.meta.env.BASE_URL}product-details.html?product=${encodeURIComponent(creation.productCode || creation.id)}`;

const isBurnCake = (creation: CreationItem) =>
  /burn cake/i.test(creation.title) || /burn-cake/i.test(creation.productCode || creation.id);

const isJarCake = (creation: CreationItem) =>
  /jar cake/i.test(creation.title) || /jar-cake/i.test(creation.productCode || creation.id);

const visibleCreations = (
  selectedCategory: CreationCategory | "All",
  selectedCakeSubcategory: CakeSubcategory,
) => {
  if (selectedCategory === "All") return creations;

  if (selectedCategory !== "Cakes") {
    return creations.filter((creation) => creation.category === selectedCategory);
  }

  if (selectedCakeSubcategory === "Burn Cakes") {
    return creations.filter(isBurnCake);
  }

  if (selectedCakeSubcategory === "Jar Cakes") {
    return creations.filter(isJarCake);
  }

  const cakeCreations = creations.filter((creation) => creation.category === "Cakes");
  if (selectedCakeSubcategory === "Traditional") {
    return cakeCreations.filter((creation) => !isBurnCake(creation) && !isJarCake(creation));
  }

  return cakeCreations;
};

export const Gallery = tag((input: GalleryOptions) => {
  let props = input;
  try {
    Gallery.inputs(([next]) => {
      props = next;
    });
  } catch {
    // Static string rendering does not create a live TaggedJS input context.
  }

  const filteredCreations = () => visibleCreations(props.selectedCategory, props.selectedCakeSubcategory);
  const pageCount = () => Math.max(1, Math.ceil(filteredCreations().length / pageSize));
  const currentPage = () => Math.min(Math.max(1, props.currentPage), pageCount());
  const pageCreations = () => {
    const start = (currentPage() - 1) * pageSize;
    return filteredCreations().slice(start, start + pageSize);
  };

  return section.class`section gallery-section`.id("creations")(
    div.class`section-heading`(
      h3("Pick a sweet starting point"),
      p("Choose a design you like, then send a quick request. Pricing and final details are confirmed after contact.")
    ),
    div.class`filter-row`.attr("aria-label", "Creation categories")(
      filterCategories.map((category) =>
        button
          .class(() => category === props.selectedCategory ? "filter-chip filter-chip-active" : "filter-chip")
          .type("button")
          .attr("aria-pressed", () => category === props.selectedCategory ? "true" : "false")
          .onClick(() => props.onSelectCategory(category))(category)
          .key(category)
      )
    ),
    () => props.selectedCategory === "Cakes"
      ? div.class`subcategory-row`(
        label.class`subcategory-label`.attr("for", "cake-subcategory")("Cake type"),
        select
          .id("cake-subcategory")
          .class`subcategory-select`
          .value(() => props.selectedCakeSubcategory)
          .onChange((event) => props.onSelectCakeSubcategory(event.target.value as CakeSubcategory))(
            cakeSubcategories.map((subcategory) => option.value(subcategory)(subcategory).key(subcategory))
          )
      )
      : null,
    div.class`creation-grid`(
      () => pageCreations().map((creation) =>
        div.class`creation-card`(
          div.class`creation-image-wrap`(
            a
              .class`creation-image`
              .href(productDetailsHref(creation))
              .style(imageStack(creation))
              .attr("aria-label", `View details for ${creation.title}`)(),
            div.class`creation-image-action`(
              () => ProductRequestButton({
                creation,
                onRequest: props.onRequest,
                className: "primary-button card-button",
              })
            )
          ),
          div.class`creation-body`(
            h3(creation.title)
          )
        ).key(creation.productCode || creation.id)
      )
    ),
    () => pageCount() > 1
      ? div.class`pagination-row`(
        button
          .class`pagination-button`
          .type("button")
          .attr("disabled", () => currentPage() === 1 ? "true" : undefined)
          .onClick(() => {
            if (currentPage() > 1) props.onSelectPage(currentPage() - 1);
          })("Previous"),
        p.class`pagination-status`(() => `Page ${currentPage()} of ${pageCount()}`),
        button
          .class`pagination-button`
          .type("button")
          .attr("disabled", () => currentPage() === pageCount() ? "true" : undefined)
          .onClick(() => {
            if (currentPage() < pageCount()) props.onSelectPage(currentPage() + 1);
          })("Next")
      )
      : null
  );
});
