import Category from "./category.model";
import { ICategory } from "../../interfaces/index.d";

const getAllCategories = async (): Promise<ICategory[]> => {
  return Category.find();
};

const createCategory = async (payload: Partial<ICategory>): Promise<ICategory> => {
  const newCategory = new Category(payload);
  return newCategory.save();
};

const deleteCategory = async (id: string): Promise<ICategory | null> => {
  return Category.findByIdAndDelete(id);
};

export const CategoryService = {
  getAllCategories,
  createCategory,
  deleteCategory,
};
