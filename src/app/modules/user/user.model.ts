import mongoose, { Schema, Model } from "mongoose";
import { IUser } from "../../interfaces/index.d";

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    password: { type: String },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    customer: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const User: Model<IUser> = mongoose.model<IUser>("User", UserSchema);
export default User;
