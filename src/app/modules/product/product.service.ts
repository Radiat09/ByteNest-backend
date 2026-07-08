import Product from "./product.model";
import { IProduct } from "../../interfaces/index.d";

interface ProductQuery {
  categories?: string;
  minPrice?: string;
  maxPrice?: string;
  searchText?: string;
  limit?: string;
  sortBy?: string;
  sortOrder?: string;
  page?: string;
}

const buildProductQuery = (queryParams: ProductQuery) => {
  const { categories, minPrice, maxPrice, searchText } = queryParams;
  const query: any = {};

  if (categories) {
    query.category = { $in: categories.split(",") };
  }

  if (minPrice && maxPrice) {
    query.price = { $gte: parseInt(minPrice), $lte: parseInt(maxPrice) };
  } else if (minPrice) {
    query.price = { $gte: parseInt(minPrice) };
  } else if (maxPrice) {
    query.price = { $lte: parseInt(maxPrice) };
  }

  if (searchText) {
    const searchRegex = new RegExp(searchText, "i");
    query.$or = [
      { title: searchRegex },
      { description: searchRegex },
      { category: searchRegex },
      { price: parseInt(searchText) || 0 },
    ];
  }

  return query;
};

const getProducts = async (queryParams: ProductQuery): Promise<any[]> => {
  const { limit, sortBy, sortOrder, searchText, page } = queryParams;
  const query = buildProductQuery(queryParams);

  let sortOptions: any = {};
  if (sortBy) {
    sortOptions[sortBy] = sortOrder === "desc" ? -1 : 1;
  }

  const limitInt = parseInt(limit || "3000", 10);
  const pageInt = parseInt(page || "0", 10);

  let cursor = Product.find(query);
  if (sortBy) {
    cursor = cursor.sort(sortOptions);
  }

  let result = await cursor.skip(pageInt * limitInt).limit(limitInt).lean();

  if (searchText) {
    const text = searchText.toLowerCase();
    const getScore = (p: any) => {
      let score = 0;
      const title = p.title?.toLowerCase() || "";
      const category = p.category?.toLowerCase() || "";
      const description = p.description?.toLowerCase() || "";

      if (category.includes(text)) score += 100;
      if (title.includes(text)) score += 50;
      if (description.includes(text)) score += 10;
      return score;
    };

    result = result
      .map((item) => ({ ...item, _score: getScore(item) }))
      .sort((a: any, b: any) => b._score - a._score);
  }

  return result;
};

const getProductCount = async (queryParams: ProductQuery): Promise<number> => {
  const query = buildProductQuery(queryParams);
  return Product.countDocuments(query);
};

const getProductById = async (id: string): Promise<IProduct | null> => {
  return Product.findById(id);
};

const createProduct = async (payload: Partial<IProduct>): Promise<IProduct> => {
  const newProduct = new Product(payload);
  return newProduct.save();
};

const updateProduct = async (id: string, payload: Partial<IProduct>): Promise<any> => {
  return Product.updateOne({ _id: id }, { $set: payload });
};

const deleteProduct = async (id: string): Promise<IProduct | null> => {
  return Product.findByIdAndDelete(id);
};

export const ProductService = {
  getProducts,
  getProductCount,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
