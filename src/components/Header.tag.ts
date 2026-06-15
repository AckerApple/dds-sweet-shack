import { a, button, div, header, img, nav, span, tag } from "taggedjs";
import { contact } from "../data/contact.js";
import { loadOrderDraft, orderDraftQuantity } from "../order-cart.js";

type HeaderOptions = {
  menuOpen: boolean;
  onToggleMenu: () => void;
  onCloseMenu: () => void;
  orderQuantity?: number;
};

const navItems = [
  { label: "Home", href: `${import.meta.env.BASE_URL}#home` },
  { label: "Creations", href: `${import.meta.env.BASE_URL}#creations` },
  { label: "Custom Order", href: `${import.meta.env.BASE_URL}custom-order.html` },
  { label: "Contact", href: `${import.meta.env.BASE_URL}contact.html` },
];

export const Header = tag((input: HeaderOptions) => {
  let props = input;
  Header.inputs(([next]) => {
    props = next;
  });

  return (
  header.class`site-header`(
    div.class`header-inner`(
      a.class`brand-link`.href(`${import.meta.env.BASE_URL}#home`).onClick(() => props.onCloseMenu())(
        img
          .class`brand-logo`
          .src(`${import.meta.env.BASE_URL}assets/logo/dds_sweet_shack_logo_transparent.png`)
          .alt("DD's Sweet Shack logo")
      ),
      button
        .class`menu-toggle`
        .type("button")
        .attr("aria-label", "Toggle navigation")
        .attr("aria-expanded", () => props.menuOpen ? "true" : "false")
        .onClick(() => props.onToggleMenu())(
          span(),
          span(),
          span()
      ),
      nav.class(() => props.menuOpen ? "site-nav site-nav-open" : "site-nav")(
        () => {
          const quantity = props.orderQuantity ?? orderDraftQuantity(loadOrderDraft());
          return navItems.map((item) =>
            a.class`site-nav-link`.href(item.href).onClick(() => props.onCloseMenu())(
              span(item.label),
              item.label === "Custom Order" && quantity > 0
                ? span.class`order-nav-badge`.attr("aria-label", `${quantity} items in order`)(String(quantity))
                : null
            )
          );
        },
        a.class`site-nav-cta`.href(contact.textHref).onClick(() => props.onCloseMenu())("Text Us")
      )
    )
  )
  );
});
