import FlashSale, { IFlashSale } from "./flash-sale.model";

const getAllFlashSales = async (): Promise<IFlashSale[]> => {
  return FlashSale.find().populate("products").sort({ createdAt: -1 });
};

const getActiveFlashSales = async (): Promise<IFlashSale[]> => {
  const now = new Date();
  return FlashSale.find({
    active: true,
    startTime: { $lte: now },
    endTime: { $gte: now },
  }).populate("products");
};

const createFlashSale = async (payload: Partial<IFlashSale>): Promise<IFlashSale> => {
  const newFlashSale = new FlashSale(payload);
  return newFlashSale.save();
};

const updateFlashSale = async (id: string, payload: Partial<IFlashSale>): Promise<IFlashSale | null> => {
  return FlashSale.findByIdAndUpdate(id, { $set: payload }, { new: true }).populate("products");
};

const deleteFlashSale = async (id: string): Promise<IFlashSale | null> => {
  return FlashSale.findByIdAndDelete(id);
};

export const FlashSaleService = {
  getAllFlashSales,
  getActiveFlashSales,
  createFlashSale,
  updateFlashSale,
  deleteFlashSale,
};
