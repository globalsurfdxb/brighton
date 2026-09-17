import mongoose from "mongoose";

const catalogueRequestSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    company: { type: String },
    email: { type: String, required: true },
    role: { type: String },
    status: {
      type: String,
      enum: ["pending", "approved"],
      default: "pending",
    },
    approvedAt: { type: Date },
  },
  { timestamps: true },
);

export default mongoose.models.catalogueRequest ||
  mongoose.model("catalogueRequest", catalogueRequestSchema);
