import mongoose, { Schema, Model } from "mongoose";
import { IWishlist } from "../../interfaces/index.d";

const WishlistSchema = new Schema<IWishlist>(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    productIds: [{ type: Schema.Types.ObjectId, ref: "Product" } as any],
  },
  { timestamps: true }
);

const Wishlist: Model<IWishlist> = mongoose.model<IWishlist>("Wishlist", WishlistSchema);
export default Wishlist;
