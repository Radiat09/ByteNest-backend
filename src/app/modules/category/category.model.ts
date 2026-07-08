import mongoose, { Schema, Model } from "mongoose";
import { ICategory } from "../../interfaces/index.d";

const CategorySchema = new Schema<ICategory>(
  {
    title: { type: String, required: true, unique: true, trim: true },
    imageUrl: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

const Category: Model<ICategory> = mongoose.model<ICategory>("Category", CategorySchema);
export default Category;
