import { a, array, div, footer, h1, h2, main, p, section, span, subscribe, tag } from "taggedjs";
import { Header } from "../components/Header.tag.js";
import { emptyDraft, OrderRequestForm, type OrderDraft } from "../components/OrderModal.tag.js";
import { contact } from "../data/contact.js";
import { createMailtoHref, customOrderCreation, orderBody } from "../order-request.js";

type CustomOrderState = {
  menuOpen: boolean;
  orderDraft: OrderDraft;
  copied: boolean;
};

const initialState: CustomOrderState = {
  menuOpen: false,
  orderDraft: {
    ...emptyDraft(),
    orderItems: [{ quantity: 1, title: "" }],
  },
  copied: false,
};

const customOrderState$ = array<CustomOrderState>([initialState]);

const getState = () => customOrderState$[0] || initialState;

const update = (patch: Partial<CustomOrderState>) => {
  customOrderState$[0] = {
    ...getState(),
    ...patch,
  };
};

const createEmailRequest = (event?: Event) => {
  const form = event?.target instanceof HTMLElement
    ? event.target.closest("form")
    : null;

  if (form instanceof HTMLFormElement && !form.reportValidity()) {
    return;
  }

  window.location.href = createMailtoHref(customOrderCreation, getState().orderDraft);
};

const copyOrderDetails = async () => {
  const text = orderBody(customOrderCreation, getState().orderDraft);
  try {
    await navigator.clipboard.writeText(text);
    update({ copied: true });
  } catch {
    window.prompt("Copy order details", text);
  }
};

const SiteFooter = () =>
  footer.class`site-footer`(
    div(
      h2("DD's Sweet Shack"),
      p("Sweet treats, made with love")
    ),
    div.class`footer-links`(
      a.href(contact.phoneHref)(contact.phoneDisplay),
      a.href(contact.emailHref)(contact.email),
      a.href(contact.facebookHref).attr("target", "_blank").attr("rel", "noreferrer")("Facebook")
    )
  );

const MobileContactBar = () =>
  div.class`mobile-contact-bar`(
    a.href(contact.textHref)("Text"),
    a.href(contact.phoneHref)("Call"),
    a.href(contact.emailHref)("Email")
  );

export const CustomOrderApp = tag(() =>
  subscribe(customOrderState$, ([state]) => [
    Header({
      menuOpen: state.menuOpen,
      onToggleMenu: () => update({ menuOpen: !state.menuOpen }),
      onCloseMenu: () => update({ menuOpen: false }),
    }),
    main.class`order-page-main`(
      section.class`section order-page-section`(
        div.class`section-heading`(
          span.class`section-kicker`("Custom Order"),
          h1("Request something sweet"),
          p("🎂 Share the treat type, event date, theme, colors, quantity, and any custom writing. DD's Sweet Shack will contact you to confirm details and pricing.")
        ),
        div.class`order-page-card`(
          p.class`form-note`("💳 No payment is collected online. DD's Sweet Shack will contact you to confirm details and pricing."),
          () => OrderRequestForm({
            selectedCreation: customOrderCreation,
            draft: state.orderDraft,
            copied: state.copied,
            showSelectedItem: false,
            onDraftChange: <K extends keyof OrderDraft>(field: K, value: OrderDraft[K]) =>
              update({
                orderDraft: { ...getState().orderDraft, [field]: value },
                copied: false,
              }),
            onCreateEmail: createEmailRequest,
            onCopy: copyOrderDetails,
          })
        )
      )
    ),
    SiteFooter(),
    MobileContactBar(),
  ])
);
