import AppError from "../../errorHelpers/AppError";
import User from "./user.model";
import { IUser } from "../../interfaces/index.d";

const createUser = async (payload: Partial<IUser>): Promise<IUser> => {
  const existingUser = await User.findOne({ email: payload.email });
  if (existingUser) {
    throw new AppError("User already exists", 400);
  }
  const newUser = new User(payload);
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

export const UserService = {
  createUser,
  getUserByEmail,
  updateUser,
  getAllUsers,
  makeAdmin,
};
