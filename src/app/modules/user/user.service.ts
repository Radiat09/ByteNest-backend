import bcrypt from "bcrypt";
import AppError from "../../errorHelpers/AppError";
import User from "./user.model";
import { IUser } from "../../interfaces/index.d";

const SALT_ROUNDS = 12;

const createUser = async (payload: Partial<IUser>): Promise<IUser> => {
  const existingUser = await User.findOne({ email: payload.email });
  if (existingUser) {
    throw new AppError("User already exists", 400);
  }

  if (!payload.password) {
    throw new AppError("Password is required", 400);
  }

  const hashedPassword = await bcrypt.hash(payload.password, SALT_ROUNDS);
  const newUser = new User({ ...payload, password: hashedPassword });
  return newUser.save();
};

const getUserByEmail = async (email: string): Promise<IUser | null> => {
  return User.findOne({ email });
};

const updateUser = async (email: string, payload: Partial<IUser>): Promise<any> => {
  return User.updateOne({ email }, { $set: payload });
};

const getAllUsers = async (customer?: string): Promise<IUser[]> => {
  const query: any = {};
  if (customer === "true") {
    query.customer = true;
  }
  return User.find(query);
};

const makeAdmin = async (email: string): Promise<any> => {
  return User.updateOne({ email }, { $set: { role: "admin" } });
};

const verifyPassword = async (email: string, password: string): Promise<IUser | null> => {
  const user = await User.findOne({ email });
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
  verifyPassword,
};
