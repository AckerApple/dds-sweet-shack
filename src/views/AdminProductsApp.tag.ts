import {
  a,
  array,
  button,
  div,
  footer,
  h1,
  h2,
  h3,
  img,
  input,
  label,
  main,
  option,
  p,
  section,
  select,
  span,
  subscribe,
  tag,
  textarea,
} from "taggedjs";
import { Header } from "../components/Header.tag.js";
import { contact } from "../data/contact.js";
import { creationCategories, type CreationCategory } from "../data/creations.js";
import { products as catalogProducts, type ProductCatalogItem } from "../data/products.js";

type AdminState = {
  menuOpen: boolean;
  products: ProductCatalogItem[];
  freeModeOpen: boolean;
  saveModeOpen: boolean;
};

type EditableProductField =
  | "title"
  | "category"
  | "description"
  | "altText"
  | "suggestedUnit"
  | "tags"
  | "featured";

const draftKey = "ddsSweetShack.adminProductsDraft.v1";

const cloneProduct = (product: ProductCatalogItem): ProductCatalogItem => ({
  ...product,
  tags: [...product.tags],
});

const baseProducts = catalogProducts.map(cloneProduct);

const isProductDraft = (value: unknown): value is ProductCatalogItem[] =>
  Array.isArray(value)
  && value.every((item) =>
    item
    && typeof item === "object"
    && typeof (item as ProductCatalogItem).productCode === "string"
  );

const timestampMs = (updatedAt?: string) => {
  if (!updatedAt) return 0;
  const parsed = Date.parse(updatedAt);
  return Number.isNaN(parsed) ? 0 : parsed;
};

const isPublishReady = (product: ProductCatalogItem) => {
  const baseProduct = baseProducts.find((entry) => entry.productCode === product.productCode);
  return timestampMs(product.updatedAt) > timestampMs(baseProduct?.updatedAt);
};

const updatedAgeLabel = (updatedAt?: string) => {
  const updatedMs = timestampMs(updatedAt);
  if (!updatedMs) return "Not changed";
  const elapsedMinutes = Math.max(0, Math.floor((Date.now() - updatedMs) / 60000));
  if (elapsedMinutes < 1) return "Changed just now";
  if (elapsedMinutes < 1440) {
    return `Changed ${elapsedMinutes} ${elapsedMinutes === 1 ? "minute" : "minutes"} ago`;
  }
  const elapsedDays = Math.floor(elapsedMinutes / 1440);
  return `Changed ${elapsedDays} ${elapsedDays === 1 ? "day" : "days"} ago`;
};

const loadSavedProducts = () => {
  if (typeof window === "undefined") return baseProducts;

  try {
    const rawDraft = window.localStorage.getItem(draftKey);
    if (!rawDraft) return baseProducts;
    const savedProducts = JSON.parse(rawDraft) as unknown;
    if (!isProductDraft(savedProducts)) return baseProducts;
    const savedByCode = new Map(savedProducts.map((product) => [product.productCode, product]));
    return baseProducts.map((product) => {
      const savedProduct = savedByCode.get(product.productCode);
      if (!savedProduct || timestampMs(savedProduct.updatedAt) <= timestampMs(product.updatedAt)) {
        return cloneProduct(product);
      }
      return {
        ...product,
        ...savedProduct,
        tags: [...savedProduct.tags],
      };
    });
  } catch {
    return baseProducts;
  }
};

const normalizeProduct = (product: ProductCatalogItem): ProductCatalogItem => ({
  productCode: product.productCode,
  title: product.title.trim(),
  category: product.category,
  description: product.description.trim(),
  imageName: product.imageName,
  imagePath: product.imagePath,
  altText: product.altText.trim(),
  suggestedUnit: product.suggestedUnit.trim(),
  tags: product.tags.map((tagName) => tagName.trim()).filter(Boolean),
  updatedAt: product.updatedAt,
  featured: product.featured || undefined,
});

const serializeProducts = (products: ProductCatalogItem[]) =>
  `${JSON.stringify(products.map(normalizeProduct), null, 2)}\n`;

const saveProducts = (products: ProductCatalogItem[]) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(draftKey, serializeProducts(products));
};

const initialState: AdminState = {
  menuOpen: false,
  products: loadSavedProducts(),
  freeModeOpen: false,
  saveModeOpen: false,
};

const adminState$ = array<AdminState>([initialState]);

const getState = () => adminState$[0] || initialState;

const update = (patch: Partial<AdminState>) => {
  adminState$[0] = {
    ...getState(),
    ...patch,
  };
};

const updateProduct = (
  productCode: string,
  field: EditableProductField,
  value: string | boolean | string[],
) => {
  const products = getState().products.map((product) =>
    product.productCode === productCode
      ? {
          ...product,
          [field]: value,
          updatedAt: new Date().toISOString(),
        }
      : product
  );
  saveProducts(products);
  update({ products });
};

const exportJson = () => {
  const json = serializeProducts(getState().products);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const downloadLink = document.createElement("a");
  downloadLink.href = url;
  downloadLink.download = "products.json";
  document.body.append(downloadLink);
  downloadLink.click();
  downloadLink.remove();
  URL.revokeObjectURL(url);
};

const resetDraft = () => {
  if (typeof window !== "undefined" && !window.confirm("Clear saved edits and reload the original product catalog?")) {
    return;
  }
  if (typeof window !== "undefined") {
    window.localStorage.removeItem(draftKey);
  }
  update({
    products: baseProducts.map(cloneProduct),
  });
};

const assetPath = (path: string) => `${import.meta.env.BASE_URL}${path.replace(/^\/+/, "")}`;

const field = (labelText: string, control: any) =>
  label.class`form-field`(
    span(labelText),
    control
  );

const readOnlyField = (labelText: string, value: string) =>
  label.class`form-field admin-readonly-field`(
    span(labelText),
    input.type("text").value(value).attr("readonly", "true")()
  );

const tagsToText = (tags: string[]) => tags.join(", ");

const textToTags = (value: string) =>
  value
    .split(",")
    .map((tagName) => tagName.trim())
    .filter(Boolean);

const AdminProductCard = (product: ProductCatalogItem) =>
  div.class`admin-product-card`(
    div.class`admin-product-media`(
      img.src(assetPath(product.imagePath)).alt(product.altText || product.title)()
    ),
    div.class`admin-product-form`(
      div.class`admin-product-heading`(
        div(
          p(`Product code: ${product.productCode}`)
        ),
        div.class`admin-status-stack`(
          span.class`admin-updated-at`(updatedAgeLabel(product.updatedAt)),
          span.class(() => isPublishReady(product) ? "admin-status-badge admin-status-ready" : "admin-status-badge")(
            () => isPublishReady(product) ? "Publish ready" : "Current catalog"
          )
        )
      ),
      div.class`admin-form-grid`(
        field(
          "Title",
          input
            .type("text")
            .value(() => product.title)
            .onInput((event) => updateProduct(product.productCode, "title", event.target.value))()
        ),
        field(
          "Category",
          select
            .value(() => product.category)
            .onChange((event) => updateProduct(product.productCode, "category", event.target.value as CreationCategory))(
              creationCategories.map((category) => option.value(category)(category))
            )
        ),
        field(
          "Suggested unit",
          input
            .type("text")
            .value(() => product.suggestedUnit)
            .onInput((event) => updateProduct(product.productCode, "suggestedUnit", event.target.value))()
        ),
        label.class`admin-checkbox-field`(
          input
            .type("checkbox")
            .attr("checked", () => product.featured ? "true" : undefined)
            .onChange((event) => updateProduct(product.productCode, "featured", event.target.checked))(),
          span("Featured")
        )
      ),
      field(
        "Description",
        textarea
          .value(() => product.description)
          .onInput((event) => updateProduct(product.productCode, "description", event.target.value))()
      ),
      field(
        "Alt text",
        input
          .type("text")
          .value(() => product.altText)
          .onInput((event) => updateProduct(product.productCode, "altText", event.target.value))()
      ),
      field(
        "Tags",
        input
          .type("text")
          .value(() => tagsToText(product.tags))
          .attr("placeholder", "cake, birthday, custom")
          .onInput((event) => updateProduct(product.productCode, "tags", textToTags(event.target.value)))()
      ),
      div.class`admin-readonly-grid`(
        readOnlyField("Image name", product.imageName),
        readOnlyField("Image path", product.imagePath)
      )
    )
  );

const FreeModeModal = () =>
  div.class`modal-backdrop`.onClick((event) => {
    if (event.target === event.currentTarget) update({ freeModeOpen: false });
  })(
    div.class`order-modal admin-free-mode-modal`.attr("role", "dialog").attr("aria-modal", "true")(
      div.class`modal-header`(
        div(
          p.class`eyebrow`("Free mode"),
          h2("Adding products is not included yet")
        ),
        button.class`icon-button`.type("button").attr("aria-label", "Close").onClick(() => update({ freeModeOpen: false }))("x")
      ),
      div.class`admin-free-mode-copy`(
        p("Adding new products is not available in free edit mode. This editor currently supports updates to products Cousin Apple has already added."),
        p("For new items, send the photos and product details to Cousin Apple or ask about a paid content update workflow."),
        button.class`primary-button`.type("button").onClick(() => update({ freeModeOpen: false }))("Got It")
      )
    )
  );

const SaveChangesModal = () =>
  div.class`modal-backdrop`.onClick((event) => {
    if (event.target === event.currentTarget) update({ saveModeOpen: false });
  })(
    div.class`order-modal admin-free-mode-modal`.attr("role", "dialog").attr("aria-modal", "true")(
      div.class`modal-header`(
        div(
          p.class`eyebrow`("Free mode"),
          h2("Download and email your changes")
        ),
        button.class`icon-button`.type("button").attr("aria-label", "Close").onClick(() => update({ saveModeOpen: false }))("x")
      ),
      div.class`admin-free-mode-copy`(
        p("Free mode saves edits only in this browser. To send the changes, download the updated products.json file and attach it to an email."),
        p("Send the attachment to acker.dawn.apple@gmail.com so Cousin Apple can update the website build."),
        div.class`modal-actions`(
          button.class`primary-button`.type("button").onClick(() => exportJson())("Download products.json"),
          a.class`secondary-button`.href("mailto:acker.dawn.apple@gmail.com?subject=DD's%20Sweet%20Shack%20Product%20Changes")("Email Cousin Apple"),
          button.class`secondary-button`.type("button").onClick(() => update({ saveModeOpen: false }))("Close")
        )
      )
    )
  );

const SiteFooter = () =>
  footer.class`site-footer`(
    div(
      h2("DD's Sweet Shack"),
      p("Product catalog editor")
    ),
    div.class`footer-links`(
      a.href(`${import.meta.env.BASE_URL}`)("Public Site"),
      a.href(contact.emailHref)("Email Cousin Apple")
    )
  );

export const AdminProductsApp = tag(() =>
  subscribe(adminState$, ([state]) => [
    Header({
      menuOpen: state.menuOpen,
      onToggleMenu: () => update({ menuOpen: !state.menuOpen }),
      onCloseMenu: () => update({ menuOpen: false }),
    }),
    main.class`admin-main`(
      section.class`section admin-section`(
        div.class`admin-page-heading`(
          div(
            span.class`section-kicker`("Admin"),
            h1("Product editor"),
            p("Edit existing gallery products. Changes save in this browser until you export the JSON file.")
          ),
          button.class`secondary-button`.type("button").onClick(() => update({ freeModeOpen: true }))("Add Product")
        ),
        div.class`admin-action-bar`(
          div(
            h2("Catalog draft"),
            p(`${state.products.length} products loaded from products.json`)
          ),
          div.class`admin-action-buttons`(
            button.class`primary-button`.type("button").onClick(() => update({ saveModeOpen: true }))("💾 Save Changes"),
            button.class`secondary-button`.type("button").onClick(() => resetDraft())("Reset Draft")
          )
        ),
        div.class`admin-product-list`(
          state.products.map(AdminProductCard)
        )
      )
    ),
    SiteFooter(),
    () => state.freeModeOpen ? FreeModeModal() : null,
    () => state.saveModeOpen ? SaveChangesModal() : null,
  ])
);
