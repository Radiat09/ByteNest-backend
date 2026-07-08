import mongoose from "mongoose";

interface QueryString {
  page?: string;
  limit?: string;
  sortBy?: string;
  sortOrder?: string;
  searchText?: string;
  [key: string]: any;
}

class QueryBuilder<T> {
  public modelQuery: mongoose.Query<any[], any>;
  public query: QueryString;

  constructor(model: mongoose.Model<any>, query: QueryString) {
    this.modelQuery = model.find();
    this.query = query;
  }

  filter(filterObj: Record<string, any>) {
    this.modelQuery = this.modelQuery.find(filterObj);
    return this;
  }

  search(fields: string[]) {
    if (this.query.searchText) {
      const regex = new RegExp(this.query.searchText, "i");
      const searchConditions = fields.map((field) => ({ [field]: regex }));
      this.modelQuery = this.modelQuery.find({ $or: searchConditions });
    }
    return this;
  }

  sort() {
    if (this.query.sortBy) {
      const sortField = this.query.sortBy;
      const sortOrder = this.query.sortOrder === "desc" ? -1 : 1;
      this.modelQuery = this.modelQuery.sort({ [sortField]: sortOrder });
    }
    return this;
  }

  paginate() {
    const limit = parseInt(this.query.limit || "3000", 10);
    const page = parseInt(this.query.page || "0", 10);
    const skip = page * limit;
    this.modelQuery = this.modelQuery.skip(skip).limit(limit);
    return this;
  }

  async execute(): Promise<T[]> {
    const result = await this.modelQuery.lean();
    return result as T[];
  }
}

export default QueryBuilder;
