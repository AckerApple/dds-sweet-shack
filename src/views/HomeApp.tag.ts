import { a, array, button, div, footer, h1, h2, main, p, section, span, subscribe, tag } from "taggedjs";
import { Header } from "../components/Header.tag.js";
import { Gallery, type CakeSubcategory } from "../components/Gallery.tag.js";
import { OrderModal, type OrderDraft } from "../components/OrderModal.tag.js";
import { contact } from "../data/contact.js";
import { creations, type CreationCategory, type CreationItem } from "../data/creations.js";
import { addCreationToOrderDraft, loadOrderDraft, orderDraftQuantity, saveOrderDraft } from "../order-cart.js";
import { createMailtoHref, customOrderCreation, orderBody } from "../order-request.js";

type AppState = {
  menuOpen: boolean;
  selectedCategory: CreationCategory | "All";
  selectedCakeSubcategory: CakeSubcategory;
  currentGalleryPage: number;
  selectedCreation: CreationItem | null;
  orderDraft: OrderDraft;
  copied: boolean;
  heroIndex: number;
  previousHeroIndex: number | null;
};

const initialState: AppState = {
  menuOpen: false,
  selectedCategory: "All",
  selectedCakeSubcategory: "All Cakes",
  currentGalleryPage: 1,
  selectedCreation: null,
  orderDraft: loadOrderDraft(),
  copied: false,
  heroIndex: 0,
  previousHeroIndex: null,
};

const appState$ = array<AppState>([initialState]);

const heroCreations = creations.filter((creation) => creation.featured);
const rotatingHeroCreations = heroCreations.length ? heroCreations : creations;

const getState = () => appState$[0] || initialState;

const update = (patch: Partial<AppState>) => {
  appState$[0] = {
    ...getState(),
    ...patch,
  };
};

const openRequest = (creation: CreationItem) => {
  const orderDraft = addCreationToOrderDraft(creation);
  update({
    selectedCreation: creation,
    orderDraft,
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

const assetPath = (path: string) => `${import.meta.env.BASE_URL}${path.replace(/^\/+/, "")}`;

const imageStack = (creation: CreationItem) => {
  const urls = [creation.image, creation.fallbackImage]
    .filter(Boolean)
    .map((path) => `url("${assetPath(path as string).replace(/"/g, "%22")}")`);
  return `background-image: ${urls.join(", ")};`;
};

const productDetailsHref = (creation: CreationItem) =>
  `${import.meta.env.BASE_URL}product-details.html?product=${encodeURIComponent(creation.productCode || creation.id)}`;

const startHeroRotation = () => {
  if (typeof window === "undefined" || rotatingHeroCreations.length < 2) return;

  window.setInterval(() => {
    const state = getState();
    const heroIndex = (state.heroIndex + 1) % rotatingHeroCreations.length;
    update({
      heroIndex,
      previousHeroIndex: state.heroIndex,
    });

    window.setTimeout(() => {
      if (getState().heroIndex === heroIndex) {
        update({ previousHeroIndex: null });
      }
    }, 750);
  }, 4000);
};

startHeroRotation();

type HeroOptions = {
  featuredCreation: CreationItem;
  previousCreation: CreationItem | null;
};

const Hero = tag((input: HeroOptions) => {
  let props = input;
  Hero.inputs(([next]) => {
    props = next;
  });

  return section.class`hero-section`.id("home")(
    div.class`hero-content`(
      span.class`hero-pill`("Sweet treats, made with love."),
      h1("Custom sweets for life's sweetest moments"),
      p.class`hero-copy`("From cakes and cupcakes to treat boxes and party favors, everything is made to order just for you!"),
      div.class`hero-actions`(
        a.class`primary-button`.href(contact.textHref)("📞 Text Us"),
        a.class`secondary-button secondary-button-filled`.href(contact.phoneHref)("📞 Call Us"),
        a.class`secondary-button`.href(contact.emailHref)("✉️ Email Us")
      ),
      a.class`hero-facebook`.href(contact.facebookHref).attr("target", "_blank").attr("rel", "noreferrer")(
        "Follow us on Facebook ",
        span("f")
      )
    ),
    div
      .class`hero-media`
      .attr("role", "img")
      .attr("aria-label", () => `View details for ${props.featuredCreation.title}`)(
      div
        .class`hero-media-image`
        .style(() => imageStack(props.featuredCreation))(),
      () => props.previousCreation
        ? div
          .class`hero-media-image hero-media-image-previous`
          .style(imageStack(props.previousCreation))()
        : null,
      button
        .class`primary-button hero-image-request`
        .type("button")
        .onClick(() => openRequest(props.featuredCreation))("I Want This"),
      a
        .class`hero-product-note`
        .href(() => productDetailsHref(props.featuredCreation))(
        span(() => props.featuredCreation.title),
        p("View product details")
      )
    )
  );
});

const CustomOrders = () =>
  section.class`section custom-section`.id("custom-orders")(
    div.class`custom-panel`(
      div(
        h2("Need something made just for your event?"),
        p("🎂 Send the idea, theme, colors, date, quantity, and any custom writing. DD's Sweet Shack will follow up to confirm what is possible, timing, and pricing."),
        p.class`form-note`("💳 No payment is collected online. DD's Sweet Shack will contact you to confirm details and pricing.")
      ),
      div.class`custom-actions`(
        a.class`primary-button`.href(`${import.meta.env.BASE_URL}custom-order.html`)("Custom Order"),
        button.class`secondary-button`.type("button").onClick(() => openRequest(customOrderCreation))("Quick Request"),
        a.class`secondary-button`.href(contact.textHref)("Ask About This")
      )
    )
  );

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
      a.href(`${import.meta.env.BASE_URL}contact.html`)("Contact"),
      a.href(`${import.meta.env.BASE_URL}custom-order.html`)("Custom Order")
    )
  );

export const HomeApp = tag(() => {
  return subscribe(appState$, ([state]) => [
      Header({
        menuOpen: state.menuOpen,
        onToggleMenu: () => update({ menuOpen: !state.menuOpen }),
        onCloseMenu: () => update({ menuOpen: false }),
        orderQuantity: orderDraftQuantity(state.orderDraft),
      }),
      main(
        () => Hero({
          featuredCreation: rotatingHeroCreations[state.heroIndex % rotatingHeroCreations.length],
          previousCreation: state.previousHeroIndex === null
            ? null
            : rotatingHeroCreations[state.previousHeroIndex % rotatingHeroCreations.length],
        }),
        () => Gallery({
          selectedCategory: state.selectedCategory,
          selectedCakeSubcategory: state.selectedCakeSubcategory,
          currentPage: state.currentGalleryPage,
          onSelectCategory: (selectedCategory: CreationCategory | "All") => update({
            selectedCategory,
            currentGalleryPage: 1,
          }),
          onSelectCakeSubcategory: (selectedCakeSubcategory: CakeSubcategory) => update({
            selectedCakeSubcategory,
            currentGalleryPage: 1,
          }),
          onSelectPage: (currentGalleryPage: number) => update({ currentGalleryPage }),
          onRequest: openRequest,
        }),
        CustomOrders(),
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
      }),
    ]);
});
