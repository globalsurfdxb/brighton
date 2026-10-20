import mongoose from "mongoose";

const catalogueRequestSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    company: { type: String },
    email: { type: String, required: true },
    role: { type: String },
  },
  { timestamps: true },
);

export default mongoose.models.catalogueRequest ||
  mongoose.model("catalogueRequest", catalogueRequestSchema);
