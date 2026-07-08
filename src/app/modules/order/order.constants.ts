export const ORDER_SEARCHABLE_FIELDS: string[] = [];

export const ORDER_SORTABLE_FIELDS = ["createdAt", "totalPrice", "paymentStatus", "orderStatus"];

export const PAYMENT_METHODS = ["COD", "Stripe"] as const;

export const PAYMENT_STATUSES = ["pending", "completed", "failed", "cancelled"] as const;

export const ORDER_STATUSES = ["pending", "completed", "cancelled"] as const;
