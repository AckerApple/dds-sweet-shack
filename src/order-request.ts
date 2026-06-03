import { contact } from "./data/contact.js";
import type { CreationItem } from "./data/creations.js";
import type { OrderDraft } from "./components/OrderModal.tag.js";

export const formatOrderItems = (draft: OrderDraft) =>
  draft.orderItems
    .map((item) => {
      const productCode = item.productCode ? ` [${item.productCode}]` : "";
      return `${item.quantity || 1} x ${item.title || "Untitled item"}${productCode}`;
    })
    .join("\n");

export const orderDetailsParam = (draft: OrderDraft) =>
  draft.orderItems
    .filter((item) => item.productCode)
    .map((item) => `${encodeURIComponent(item.productCode as string)}:${Math.max(1, item.quantity || 1)}`)
    .join(",");

export const createOrderDetailsUrl = (draft: OrderDraft) => {
  const items = orderDetailsParam(draft);
  if (!items) return "";
  return `https://${contact.website}/order-details.html?items=${items}`;
};

export const orderBody = (creation: CreationItem, draft: OrderDraft) =>
  [
    "DD's Sweet Shack Order Request",
    "",
    "Selected item:",
    creation.title,
    "",
    "Customer name:",
    draft.customerName,
    "",
    "What are you wanting to order:",
    formatOrderItems(draft),
    "",
    "View order details:",
    createOrderDetailsUrl(draft) || "No catalog products selected.",
    "",
    "Needed by:",
    draft.neededBy,
    "",
    "Best number:",
    draft.bestNumber,
    "",
    "Additional details/custom writing:",
    draft.additionalDetails,
    "",
    "Message:",
    "Thank you for your order. I will be in contact to go over the details/specifics and to go over pricing.",
  ].join("\n");

export const createMailtoHref = (creation: CreationItem, draft: OrderDraft) => {
  const subject = `Order Request: ${creation.title}`;
  const body = orderBody(creation, draft);
  return `mailto:${contact.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
};

export const customOrderCreation: CreationItem = {
  id: "custom-order",
  title: "Custom Order",
  category: "Cakes",
  description: "Custom order request",
  image: "/assets/creations/farm-birthday-cake.svg",
};
