import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    products: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Products",
      },
    ],
    payment: {},
    buyers: {
      type: mongoose.Schema.ObjectId,
      ref: "user",
    },
    status: {
      type: String,
      default: "Not-Processing",
      enum: [
        "Not-Processing",
        "ordered",
        "Packaging",
        "Processing",
        "Dispatch",
        "ReadyShipping",                                                  
        "shipped",
        "Delivered",
        "cancel",
      ],
    },
  },
  { timestamps: true }
);
export default mongoose.model("order", orderSchema);
