import { Request } from "express";

declare module "express" {
  interface Request {
    rawBody?: Buffer;
  }
}

export interface IUser {
  _id?: string;
  name: string;
  email: string;
  password?: string;
  role: "user" | "admin";
  customer: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IProduct {
  _id?: string;
  title: string;
  description?: string;
  price: number;
  discountedPrice?: number | null;
  category: string;
  imageUrl: string[];
  sellCount: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ICategory {
  _id?: string;
  title: string;
  imageUrl: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ICart {
  _id?: string;
  productId: string;
  email: string;
  quantity: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IWishlist {
  _id?: string;
  email: string;
  productIds: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ICustomerDetail {
  email: string;
  name: string;
  companyName?: string;
  address: string;
  apartMentFloor?: string;
  PhoneNumber: string;
}

export interface IOrderItem {
  productId: string;
  quantity: number;
  title?: string;
  price?: number;
  imageUrl?: string[];
  discountedPrice?: number;
}

export interface IOrder {
  _id?: string;
  customerDetail: ICustomerDetail;
  cartData: IOrderItem[];
  totalPrice: number;
  discount: number;
  paymentMethod: "COD" | "Stripe";
  paymentStatus: "pending" | "completed" | "failed" | "cancelled";
  orderStatus: "pending" | "completed" | "cancelled";
  date?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface AuthRequest extends Request {
  user?: {
    email: string;
    role: string;
  };
}
