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

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
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
    const safeText = escapeRegex(searchText);
    const searchRegex = new RegExp(safeText, "i");
    query.$or = [
      { title: searchRegex },
      { description: searchRegex },
      { category: searchRegex },
    ];
  }

  return query;
};

const getProducts = async (queryParams: ProductQuery) => {
  const { limit, sortBy, sortOrder, searchText, page } = queryParams;
  const query = buildProductQuery(queryParams);

  let sortOptions: any = {};
  if (sortBy) {
    sortOptions[sortBy] = sortOrder === "desc" ? -1 : 1;
  }

  const limitInt = parseInt(limit || "12", 10);
  const pageInt = parseInt(page || "1", 10);
  const skip = (pageInt - 1) * limitInt;

  const total = await Product.countDocuments(query);

  let cursor = Product.find(query);
  if (sortBy) {
    cursor = cursor.sort(sortOptions);
  }

  let result = await cursor.skip(skip).limit(limitInt).lean();

  if (searchText) {
    const text = searchText.toLowerCase();
    const safeText = escapeRegex(text);
    const getScore = (p: any) => {
      let score = 0;
      const title = p.title?.toLowerCase() || "";
      const category = p.category?.toLowerCase() || "";
      const description = p.description?.toLowerCase() || "";

      try {
        const re = new RegExp(safeText, "i");
        if (re.test(category)) score += 100;
        if (re.test(title)) score += 50;
        if (re.test(description)) score += 10;
      } catch {
        // fallback: plain includes
        if (category.includes(text)) score += 100;
        if (title.includes(text)) score += 50;
        if (description.includes(text)) score += 10;
      }
      return score;
    };

    result = result
      .map((item) => ({ ...item, _score: getScore(item) }))
      .sort((a: any, b: any) => b._score - a._score);
  }

  return {
    products: result,
    total,
    page: pageInt,
    limit: limitInt,
    totalPages: Math.ceil(total / limitInt),
  };
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

const getSearchSuggestions = async (searchText: string): Promise<any[]> => {
  if (!searchText || searchText.trim().length === 0) return [];
  const safeText = escapeRegex(searchText.trim());
  const regex = new RegExp(safeText, "i");
  return Product.find({
    $or: [{ title: regex }, { category: regex }],
  })
    .select("title category imageUrl")
    .limit(8)
    .lean();
};

export const ProductService = {
  getProducts,
  getProductCount,
  getSearchSuggestions,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
