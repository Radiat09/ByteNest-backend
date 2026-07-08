export const ROLE = {
  USER: "user",
  ADMIN: "admin",
} as const;

export const PAYMENT_METHOD = {
  COD: "COD",
  STRIPE: "Stripe",
} as const;

export const PAYMENT_STATUS = {
  PENDING: "pending",
  COMPLETED: "completed",
  FAILED: "failed",
  CANCELLED: "cancelled",
} as const;

export const ORDER_STATUS = {
  PENDING: "pending",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
} as const;

export const PAGINATION_LIMIT = 3000;
export const PAGINATION_PAGE = 0;
