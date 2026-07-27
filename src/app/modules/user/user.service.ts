import bcrypt from "bcrypt";
import AppError from "../../errorHelpers/AppError";
import User from "./user.model";
import { IUser } from "../../interfaces/index.d";

const SALT_ROUNDS = 12;

const createUser = async (payload: Partial<IUser>): Promise<IUser> => {
  if (!payload.email) {
    throw new AppError("Email is required", 400);
  }
  const existingUser = await User.findOne({ email: payload.email.toLowerCase() });
  if (existingUser) {
    throw new AppError("User already exists", 400);
  }

  if (!payload.password) {
    throw new AppError("Password is required", 400);
  }

  const hashedPassword = await bcrypt.hash(payload.password, SALT_ROUNDS);
  const newUser = new User({ ...payload, password: hashedPassword, role: "user" });
  return newUser.save();
};

const getUserByEmail = async (email: string): Promise<IUser | null> => {
  return User.findOne({ email: email.toLowerCase() });
};

const updateUser = async (email: string, payload: Partial<IUser>): Promise<any> => {
  return User.updateOne({ email: email.toLowerCase() }, { $set: payload });
};

const getAllUsers = async (customer?: string): Promise<IUser[]> => {
  const query: any = {};
  if (customer === "true") {
    query.customer = true;
  }
  return User.find(query);
};

const makeAdmin = async (email: string): Promise<any> => {
  return User.updateOne({ email: email.toLowerCase() }, { $set: { role: "admin" } });
};

const banUser = async (email: string): Promise<any> => {
  return User.updateOne({ email: email.toLowerCase() }, { $set: { isBanned: true } });
};

const unbanUser = async (email: string): Promise<any> => {
  return User.updateOne({ email: email.toLowerCase() }, { $set: { isBanned: false } });
};

const verifyPassword = async (email: string, password: string): Promise<IUser | null> => {
  const user = await User.findOne({ email: email.toLowerCase() }).select("+password");
  if (!user || !user.password) return null;

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return null;

  return user;
};

export const UserService = {
  createUser,
  getUserByEmail,
  updateUser,
  getAllUsers,
  makeAdmin,
  banUser,
  unbanUser,
  verifyPassword,
};
