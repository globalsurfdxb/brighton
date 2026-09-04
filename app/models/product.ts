import mongoose from "mongoose";

// PRODUCT CATEGORY (Interior / Exterior)

const categorySchema = new mongoose.Schema({
  title: { type: String },
  slug: { type: String },
  homeSection: {
    description: { type: String },
    video: { type: String },
    videoAlt: { type: String },
    posterImage: { type: String },
    posterImageAlt: { type: String },
    btnText: { type: String },
    btnLink: { type: String },
  },
});

const subCategorySchema = new mongoose.Schema({
  title: { type: String },
  icon: { type: String },
  iconAlt: { type: String },
  category: { type: mongoose.Schema.Types.ObjectId, ref: "category" },
});

const configCategorySchema = new mongoose.Schema({
  title: { type: String },
  previewType: {
    type: String,
    enum: ["none", "shape", "swatch", "size", "beam", "gradient"],
    default: "none",
  },
});

const configOptionSchema = new mongoose.Schema({
  category: { type: mongoose.Schema.Types.ObjectId, ref: "configcategory" },
  label: { type: String },
  code: { type: String },
  swatchColor: { type: String },

  tooltip: {
    label: { type: String },
    meta: { type: String },
    preview: {
      type: {
        type: String,
        enum: ["none", "shape", "swatch", "size", "beam", "gradient"],
        default: "none",
      },
      shape: {
        type: String,
        enum: [
          "round",
          "square",
          "round-thick",
          "square-thick",
          "circle-dot",
          "trimless",
          "trim",
        ],
      },
      color: { type: String },
      gradient: { type: String },
      sizeBox: {
        width: { type: Number },
        height: { type: Number },
      },
      beamAngle: { type: Number },
    },
  },
});

// PRODUCT

const productSchema = new mongoose.Schema({
  title: { type: String },
  isHidden: { type: Boolean, default: false },
  category: { type: mongoose.Schema.Types.ObjectId, ref: "category" },
  subCategory: { type: mongoose.Schema.Types.ObjectId, ref: "subcategory" },

  // Key Details
  thumbImage: { type: String },
  thumbImageAlt: { type: String },
  hoverImage: { type: String },
  hoverImageAlt: { type: String },
  productCode: { type: String },

  // First section
  description: { type: String },
  stats: {
    type: [String],
    default: [],
  },
  images: {
    type: [String],
    default: [],
  },

  // Second section
  secondSection: {
    title: { type: String },
    description: { type: String },
    configurations: {
      type: [
        {
          category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "configcategory",
          },
          options: {
            type: [mongoose.Schema.Types.ObjectId],
            ref: "configoption",
            default: [],
          },
        },
      ],
      default: [],
    },
  },

  // Third section
  thirdSection: {
    title: { type: String },
    items: {
      type: [
        {
          title: { type: String },
          items: {
            type: [
              {
                key: { type: String },
                value: { type: String },
              },
            ],
            default: [],
          },
        },
      ],
      default: [],
    },
  },
});

export const Category =
  mongoose.models.category || mongoose.model("category", categorySchema);

export const SubCategory =
  mongoose.models.subcategory ||
  mongoose.model("subcategory", subCategorySchema);

export const ConfigCategory =
  mongoose.models.configcategory ||
  mongoose.model("configcategory", configCategorySchema);

export const ConfigOption =
  mongoose.models.configoption ||
  mongoose.model("configoption", configOptionSchema);

export const Product =
  mongoose.models.product || mongoose.model("product", productSchema);
