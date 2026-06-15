import type { CreationItem } from "./data/creations.js";
import type { OrderDraft, OrderItem } from "./components/OrderModal.tag.js";

const orderDraftStorageKey = "ddsSweetShack.orderDraft.v1";

const emptyStoredDraft = (): OrderDraft => ({
  customerName: "",
  orderItems: [{ quantity: 1, title: "" }],
  neededBy: "",
  bestNumber: "",
  additionalDetails: "",
});

const canUseStorage = () =>
  typeof window !== "undefined" && typeof window.localStorage !== "undefined";

const normalizeItems = (items: OrderItem[]) =>
  items.length ? items : [{ quantity: 1, title: "" }];

export const orderDraftQuantity = (draft: OrderDraft) =>
  draft.orderItems
    .filter((item) => item.title || item.productCode)
    .reduce((total, item) => total + Math.max(0, Number(item.quantity) || 0), 0);

export const loadOrderDraft = (): OrderDraft => {
  if (!canUseStorage()) return emptyStoredDraft();

  try {
    const stored = window.localStorage.getItem(orderDraftStorageKey);
    if (!stored) return emptyStoredDraft();
    const parsed = JSON.parse(stored) as Partial<OrderDraft>;

    return {
      ...emptyStoredDraft(),
      ...parsed,
      orderItems: normalizeItems(parsed.orderItems || []),
    };
  } catch {
    return emptyStoredDraft();
  }
};

export const saveOrderDraft = (draft: OrderDraft) => {
  if (!canUseStorage()) return;

  window.localStorage.setItem(
    orderDraftStorageKey,
    JSON.stringify({
      ...draft,
      orderItems: normalizeItems(draft.orderItems),
    }),
  );
};

export const addCreationToOrderDraft = (creation: CreationItem) => {
  const draft = loadOrderDraft();
  const existingItems = draft.orderItems.filter((item) => item.title || item.productCode);
  const existingIndex = creation.productCode
    ? existingItems.findIndex((item) => item.productCode === creation.productCode)
    : -1;

  const nextItems = existingIndex >= 0
    ? existingItems.map((item, index) =>
        index === existingIndex
          ? { ...item, quantity: (item.quantity || 1) + 1 }
          : item
      )
    : [
        ...existingItems,
        {
          quantity: 1,
          title: creation.title,
          productCode: creation.productCode,
        },
      ];

  const nextDraft = {
    ...draft,
    orderItems: normalizeItems(nextItems),
  };

  saveOrderDraft(nextDraft);
  return nextDraft;
};
