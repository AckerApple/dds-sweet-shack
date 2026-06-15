import { a, array, div, footer, h1, h2, h3, main, p, section, span, subscribe, tag } from "taggedjs";
import { Header } from "../components/Header.tag.js";
import { contact } from "../data/contact.js";
import { productByCode } from "../data/products.js";

type OrderDetailsState = {
  menuOpen: boolean;
};

type DecodedOrderItem = {
  productCode: string;
  quantity: number;
};

const orderDetailsState$ = array<OrderDetailsState>([{ menuOpen: false }]);

const getState = () => orderDetailsState$[0] || { menuOpen: false };

const update = (patch: Partial<OrderDetailsState>) => {
  orderDetailsState$[0] = {
    ...getState(),
    ...patch,
  };
};

const assetPath = (path: string) => `${import.meta.env.BASE_URL}${path.replace(/^\/+/, "")}`;

const parseOrderItems = (): DecodedOrderItem[] => {
  const params = new URLSearchParams(typeof window === "undefined" ? "" : window.location.search);
  const items = params.get("items") || "";

  return items
    .split(",")
    .map((entry) => {
      const [rawCode, rawQuantity] = entry.split(":");
      const productCode = decodeURIComponent(rawCode || "").trim();
      const quantity = Math.max(1, Number(rawQuantity) || 1);
      return productCode ? { productCode, quantity } : null;
    })
    .filter((item): item is DecodedOrderItem => Boolean(item));
};

const decodedItems = parseOrderItems();

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

const OrderProductCard = (item: DecodedOrderItem) => {
  const product = productByCode.get(item.productCode);

  if (!product) {
    return div.class`order-detail-card order-detail-card-missing`(
      div.class`order-detail-body`(
        span.class`category-label`("Not Found"),
        h3("Unknown product"),
        p(`Product code: ${item.productCode}`),
        p(`Quantity: ${item.quantity}`)
      )
    );
  }

  return div.class`order-detail-card`(
    div
      .class`order-detail-image`
      .style(`background-image: url("${assetPath(product.imagePath).replace(/"/g, "%22")}");`)
      .attr("role", "img")
      .attr("aria-label", product.altText)(),
    div.class`order-detail-body`(
      div.class`order-detail-meta`(
        span.class`category-label`(product.category),
        span.class`order-quantity`(`Qty ${item.quantity}`)
      ),
      h3(product.title),
      p(product.description),
      p.class`product-code-line`(`Product code: ${product.productCode}`),
      p.class`product-code-line`(`Image: ${product.imageName}`)
    )
  );
};

export const renderOrderDetailsApp = (state: OrderDetailsState = getState()) => [
  Header({
    menuOpen: state.menuOpen,
    onToggleMenu: () => update({ menuOpen: !state.menuOpen }),
    onCloseMenu: () => update({ menuOpen: false }),
  }),
  main.class`order-details-main`(
    section.class`section order-details-section`(
      div.class`section-heading`(
        span.class`section-kicker`("Order Details"),
        h1("Requested sweets"),
        p("Review the product photos, quantities, and product codes included in this order request.")
      ),
      decodedItems.length
        ? div.class`order-detail-grid`(
            decodedItems.map((item) => OrderProductCard(item))
          )
        : div.class`empty-order-details`(
            h2("No products found"),
            p("This link does not include product codes. Start from the gallery and choose I Want This to create a product-based order link."),
            a.class`primary-button`.href(`${import.meta.env.BASE_URL}#creations`)("View Gallery")
          )
    )
  ),
  SiteFooter(),
  MobileContactBar(),
];

export const OrderDetailsApp = tag(() => subscribe(orderDetailsState$, ([state]) => renderOrderDetailsApp(state)));
