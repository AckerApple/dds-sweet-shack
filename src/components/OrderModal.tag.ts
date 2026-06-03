import {
  button,
  div,
  form,
  h2,
  input,
  label,
  option,
  p,
  select,
  span,
  tag,
  textarea,
} from "taggedjs";
import type { CreationItem } from "../data/creations.js";
import { contact } from "../data/contact.js";
import { products } from "../data/products.js";

export type OrderDraft = {
  customerName: string;
  orderItems: OrderItem[];
  neededBy: string;
  bestNumber: string;
  additionalDetails: string;
};

export type OrderItem = {
  quantity: number;
  title: string;
  productCode?: string;
};

type OrderModalOptions = {
  selectedCreation: CreationItem | null;
  draft: OrderDraft;
  copied: boolean;
  onClose: () => void;
  onDraftChange: <K extends keyof OrderDraft>(field: K, value: OrderDraft[K]) => void;
  onCreateEmail: (event?: Event) => void;
  onCopy: () => void;
};

export type OrderRequestFormOptions = {
  selectedCreation: CreationItem;
  draft: OrderDraft;
  copied: boolean;
  onDraftChange: <K extends keyof OrderDraft>(field: K, value: OrderDraft[K]) => void;
  onCreateEmail: (event?: Event) => void;
  onCopy: () => void;
  onContinue?: () => void;
  showSelectedItem?: boolean;
};

const field = (
  labelText: string,
  control: any,
) =>
  label.class`form-field`(
    span(labelText),
    control
  );

export const emptyDraft = (): OrderDraft => ({
  customerName: "",
  orderItems: [{ quantity: 1, title: "" }],
  neededBy: "",
  bestNumber: "",
  additionalDetails: "",
});

const updateOrderItem = (
  items: OrderItem[],
  index: number,
  patch: Partial<OrderItem>,
) =>
  items.map((item, itemIndex) =>
    itemIndex === index
      ? { ...item, ...patch }
      : item
  );

const removeOrderItem = (items: OrderItem[], index: number) => {
  const nextItems = items.filter((_, itemIndex) => itemIndex !== index);
  return nextItems.length ? nextItems : [{ quantity: 1, title: "" }];
};

export const OrderRequestForm = tag((options: OrderRequestFormOptions) => {
  let props = options;
  OrderRequestForm.inputs(([next]) => {
    props = next;
  });

  return (
  form.class`request-form`(
    () => (props.showSelectedItem ?? true)
      ? p.class`selected-item-line`(`Selected item: ${props.selectedCreation.title}`)
      : null,
    field(
      "👤 Customer name",
      input
        .type("text")
        .value(() => props.draft.customerName)
        .attr("required", "true")
        .onInput((event) => props.onDraftChange("customerName", event.target.value))()
    ),
    div.class`order-items-field`(
      div.class`order-items-heading`(
        span("🧁 What are you wanting to order?"),
        button.class`small-action-button`.type("button").onClick(() =>
          props.onDraftChange("orderItems", [
            ...props.draft.orderItems,
            { quantity: 1, title: "" },
          ])
        )("Add item")
      ),
      () => props.draft.orderItems.map((item, index) =>
        div.class`order-item-row`(
          label.class`form-field order-item-qty`(
            span("Qty"),
            input
              .type("number")
              .min("1")
              .step("1")
              .value(() => String(item.quantity || 1))
              .attr("required", "true")
              .onInput((event) =>
                props.onDraftChange(
                  "orderItems",
                  updateOrderItem(props.draft.orderItems, index, {
                    quantity: Math.max(1, Number(event.target.value) || 1),
                  }),
                )
              )()
          ),
          label.class`form-field order-item-title`(
            span("Item"),
            select
              .value(() => item.productCode || (item.title ? "custom" : ""))
              .attr("required", "true")
              .onChange((event) => {
                const productCode = event.target.value;
                const product = products.find((entry) => entry.productCode === productCode);
                props.onDraftChange(
                  "orderItems",
                  updateOrderItem(props.draft.orderItems, index, product
                    ? {
                        productCode: product.productCode,
                        title: product.title,
                      }
                    : {
                        productCode: undefined,
                        title: productCode === "custom" ? "Custom item" : "",
                      }),
                );
              })(
                option.value("").attr("disabled", "true")("Select a product"),
                products.map((product) =>
                  option.value(product.productCode)(`${product.title} (${product.productCode})`)
                ),
                option.value("custom")("Custom / not pictured")
              ),
            () => item.productCode === undefined
              ? input
                .type("text")
                .value(() => item.title)
                .attr("required", "true")
                .attr("placeholder", "Describe custom item")
                .onInput((event) =>
                  props.onDraftChange(
                    "orderItems",
                    updateOrderItem(props.draft.orderItems, index, {
                      title: event.target.value,
                    }),
                  )
                )()
              : null,
            () => item.productCode
              ? input
                .type("hidden")
                .value(() => item.productCode || "")()
              : null
          ),
          label.class`form-field order-item-code`(
            span("Code"),
            input
              .type("text")
              .value(() => item.productCode || "custom")
              .attr("readonly", "true")
              .attr("aria-label", "Product code")()
          ),
          button
            .class`icon-button order-item-remove`
            .type("button")
            .attr("aria-label", "Remove order item")
            .onClick(() => props.onDraftChange("orderItems", removeOrderItem(props.draft.orderItems, index)))("x")
        )
      )
    ),
    div.class`form-grid`(
      field(
        "🗓️ When do you need this order by?",
        input
          .type("text")
          .value(() => props.draft.neededBy)
          .attr("placeholder", "Date/time")
          .attr("required", "true")
          .onInput((event) => props.onDraftChange("neededBy", event.target.value))()
      )
    ),
    field(
      "📱 Phone number",
      input
        .type("tel")
        .value(() => props.draft.bestNumber)
        .attr("required", "true")
        .onInput((event) => props.onDraftChange("bestNumber", event.target.value))()
    ),
    field(
      "✍️ Additional details / custom writing",
      textarea
        .value(() => props.draft.additionalDetails)
        .onInput((event) => props.onDraftChange("additionalDetails", event.target.value))()
    ),
    div.class`modal-actions`(
      button.class`primary-button`.type("button").onClick((event) => props.onCreateEmail(event))("Create Email Request"),
      button.class`secondary-button`.type("button").onClick(() => props.onCopy())(
        () => props.copied ? "Copied" : "Copy Order Details"
      ),
      () => props.onContinue
        ? button.class`secondary-button`.type("button").onClick(() => props.onContinue?.())("Continue Browsing")
        : null
    ),
    p.class`mailto-help`(`Email opens to ${contact.email}. If it does not open, copy the order details instead.`)
  )
  );
});

export const OrderModal = tag((input: OrderModalOptions) => {
  let props = input;
  OrderModal.inputs(([next]) => {
    props = next;
  });

  return div.class`modal-root`(
    () => {
      const selectedCreation = props.selectedCreation;
      if (!selectedCreation) return null;

      return div.class`modal-backdrop`.onClick((event) => {
        if (event.target === event.currentTarget) props.onClose();
      })(
      div.class`order-modal`.attr("role", "dialog").attr("aria-modal", "true")(
        div.class`modal-header`(
          div(
            p.class`eyebrow`("🧁 Order request"),
            h2(`Request: ${selectedCreation.title}`)
          ),
          button.class`icon-button`.type("button").attr("aria-label", "Close request form").onClick(() => props.onClose())("x")
        ),
        p.class`form-note`(
          "💳 No payment is collected online. DD's Sweet Shack will contact you to confirm details and pricing."
        ),
        () => OrderRequestForm({
          selectedCreation,
          draft: props.draft,
          copied: props.copied,
          onDraftChange: props.onDraftChange,
          onCreateEmail: props.onCreateEmail,
          onCopy: props.onCopy,
          onContinue: props.onClose,
        })
      )
    );
    }
  );
});
