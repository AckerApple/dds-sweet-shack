import { a, array, div, footer, h1, h2, main, p, section, span, subscribe, tag } from "taggedjs";
import { Header } from "../components/Header.tag.js";
import { OrderModal, type OrderDraft } from "../components/OrderModal.tag.js";
import { ProductRequestButton } from "../components/ProductActions.tag.js";
import { contact } from "../data/contact.js";
import { productByCode, productToCreation, products } from "../data/products.js";
import type { CreationItem } from "../data/creations.js";
import { addCreationToOrderDraft, loadOrderDraft, orderDraftQuantity, saveOrderDraft } from "../order-cart.js";
import { createMailtoHref, orderBody } from "../order-request.js";

type ProductDetailsState = {
  menuOpen: boolean;
  selectedCreation: CreationItem | null;
  orderDraft: OrderDraft;
  copied: boolean;
};

const getSearchParams = () =>
  new URLSearchParams(typeof window === "undefined" ? "" : window.location.search);

const params = getSearchParams();
const requestedCode = params.get("product") || params.get("code") || "";
const selectedProduct = requestedCode ? productByCode.get(requestedCode) : products[0];
const selectedCreation = selectedProduct ? productToCreation(selectedProduct) : null;

const productDetailsState$ = array<ProductDetailsState>([{
  menuOpen: false,
  selectedCreation: null,
  orderDraft: loadOrderDraft(),
  copied: false,
}]);

const getState = () => productDetailsState$[0];

const update = (patch: Partial<ProductDetailsState>) => {
  productDetailsState$[0] = {
    ...getState(),
    ...patch,
  };
};

const assetPath = (path: string) => `${import.meta.env.BASE_URL}${path.replace(/^\/+/, "")}`;

const openRequest = (creation: CreationItem) => {
  update({
    selectedCreation: creation,
    orderDraft: addCreationToOrderDraft(creation),
    copied: false,
    menuOpen: false,
  });
};

const createEmailRequest = (event?: Event) => {
  const form = event?.target instanceof HTMLElement
    ? event.target.closest("form")
    : null;

  if (form instanceof HTMLFormElement && !form.reportValidity()) {
    return;
  }

  const state = getState();
  if (!state.selectedCreation) return;
  saveOrderDraft(state.orderDraft);
  window.location.href = createMailtoHref(state.selectedCreation, state.orderDraft);
};

const copyOrderDetails = async () => {
  const state = getState();
  if (!state.selectedCreation) return;
  saveOrderDraft(state.orderDraft);
  const text = orderBody(state.selectedCreation, state.orderDraft);
  try {
    await navigator.clipboard.writeText(text);
    update({ copied: true });
  } catch {
    window.prompt("Copy order details", text);
  }
};

const MobileContactBar = () =>
  div.class`mobile-contact-bar`(
    a.href(contact.textHref)("Text"),
    a.href(contact.phoneHref)("Call"),
    a.href(contact.emailHref)("Email")
  );

const SiteFooter = () =>
  footer.class`site-footer`(
    div(
      h2("DD's Sweet Shack"),
      p("Sweet treats, made with love")
    ),
    div.class`footer-links`(
      a.href(`${import.meta.env.BASE_URL}`)("Home"),
      a.href(`${import.meta.env.BASE_URL}custom-order.html`)("Custom Order")
    )
  );

const ProductDetails = () => {
  if (!selectedProduct || !selectedCreation) {
    return div.class`empty-order-details`(
      h2("Product not found"),
      p("This product link does not match a product in the catalog."),
      a.class`primary-button`.href(`${import.meta.env.BASE_URL}#creations`)("View Gallery")
    );
  }

  return div.class`product-detail-layout`(
    div
      .class`product-detail-image`
      .style(`background-image: url("${assetPath(selectedProduct.imagePath).replace(/"/g, "%22")}");`)
      .attr("role", "img")
      .attr("aria-label", selectedProduct.altText)(),
    div.class`product-detail-copy`(
      span.class`category-label`(selectedProduct.category),
      h1(selectedProduct.title),
      p(selectedProduct.description),
      div.class`product-detail-facts`(
        p(`Product code: ${selectedProduct.productCode}`),
        p(`Image: ${selectedProduct.imageName}`),
        p(`Suggested unit: ${selectedProduct.suggestedUnit}`)
      ),
      div.class`product-detail-tags`(
        selectedProduct.tags.map((tagText) => span(tagText))
      ),
      div.class`product-detail-actions`(
        () => ProductRequestButton({
          creation: selectedCreation,
          onRequest: openRequest,
        }),
        a.class`secondary-button`.href(`${import.meta.env.BASE_URL}#creations`)("Back to Gallery")
      )
    )
  );
};

export const renderProductDetailsApp = (state: ProductDetailsState = getState()) => [
  Header({
    menuOpen: state.menuOpen,
    onToggleMenu: () => update({ menuOpen: !state.menuOpen }),
    onCloseMenu: () => update({ menuOpen: false }),
    orderQuantity: orderDraftQuantity(state.orderDraft),
  }),
  main.class`product-detail-main`(
    section.class`section product-detail-section`(
      ProductDetails()
    )
  ),
  SiteFooter(),
  MobileContactBar(),
  () => OrderModal({
    selectedCreation: state.selectedCreation,
    draft: state.orderDraft,
    copied: state.copied,
    onClose: () => update({ selectedCreation: null, copied: false }),
    onDraftChange: <K extends keyof OrderDraft>(field: K, value: OrderDraft[K]) => {
      const orderDraft = { ...getState().orderDraft, [field]: value };
      saveOrderDraft(orderDraft);
      update({ orderDraft, copied: false });
    },
    onCreateEmail: createEmailRequest,
    onCopy: copyOrderDetails,
  })
];

export const ProductDetailsApp = tag(() => subscribe(productDetailsState$, ([state]) => renderProductDetailsApp(state)));
