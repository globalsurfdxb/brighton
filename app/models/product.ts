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
  slug: { type: String },
  order: { type: Number, default: 0 },
  icon: { type: String },
  iconAlt: { type: String },
  category: { type: mongoose.Schema.Types.ObjectId, ref: "category" },
});

const configCategorySchema = new mongoose.Schema({
  title: { type: String },
  order: { type: Number, default: 0 },
  previewType: {
    type: String,
    enum: ["none", "shape", "swatch", "size", "beam", "gradient"],
    default: "none",
  },
  // Common categories are auto-included (with all their current options) in
  // every product's configuration, toggled per-product like common specs/icons.
  isCommon: { type: Boolean, default: false },
});

const configOptionSchema = new mongoose.Schema({
  category: { type: mongoose.Schema.Types.ObjectId, ref: "configcategory" },
  order: { type: Number, default: 0 },
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

// SPEC (common, reusable across products)

const specSchema = new mongoose.Schema({
  label: { type: String },
});

// ICON (reusable across products' datasheets — master list lives under
// Products > Master Data > Icons)

const iconSchema = new mongoose.Schema({
  image: { type: String },
  // common icons are automatically included on every product's datasheet;
  // non-common ones are picked per-product under datasheet.icons.specific
  isCommon: { type: Boolean, default: false },
});

// GENERATED QR (created whenever a shopper generates a QR code for a configured product)

const generatedQrSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: "product" },
    productTitle: { type: String },
    productCode: { type: String },
    url: { type: String },
    image: { type: String },
  },
  { timestamps: true },
);

// PRODUCT

const productSchema = new mongoose.Schema({
  title: { type: String },
  slug: { type: String },
  isHidden: { type: Boolean, default: false },
  category: { type: mongoose.Schema.Types.ObjectId, ref: "category" },
  subCategory: { type: mongoose.Schema.Types.ObjectId, ref: "subcategory" },

  // Key Details
  thumbImage: { type: String },
  thumbImageAlt: { type: String },
  hoverImage: { type: String },
  hoverImageAlt: { type: String },
  productCode: { type: String },
  featured: { type: Boolean, default: false },

  // First section
  description: { type: String },
  specs: {
    // common specs toggled on/off for this product, plus product-specific ones
    common: {
      type: [
        {
          spec: { type: mongoose.Schema.Types.ObjectId, ref: "spec" },
          enabled: { type: Boolean, default: true },
        },
      ],
      default: [],
    },
    custom: {
      type: [String],
      default: [],
    },
  },
  images: {
    type: [
      {
        image: { type: String },
        imageAlt: { type: String },
      },
    ],
    default: [],
  },
  photometrics: {
    type: [
      {
        image: { type: String },
        imageAlt: { type: String },
        name: { type: String },
      },
    ],
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
          defaultOption: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "configoption",
          },
        },
      ],
      default: [],
    },
    // common config categories toggled on/off for this product — enabled
    // ones are merged into `configurations` (with every current option)
    // when the product is served to shoppers
    commonConfigurations: {
      type: [
        {
          category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "configcategory",
          },
          enabled: { type: Boolean, default: true },
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

  // Fourth section — downloadable resource tiles (datasheet, CAD, certifications, etc.)
  fourthSection: {
    type: [
      {
        title: { type: String },
        items: {
          type: [
            {
              title: { type: String },
              link: { type: String },
              size: { type: String },
            },
          ],
          default: [],
        },
      },
    ],
    default: [],
  },

  // Datasheet
  datasheet: {
    image: { type: String },
    installationGuide: {
      link: { type: String },
      size: { type: String },
    },
    icons: {
      // common icons (Icon.isCommon) toggled on/off for this product,
      // default enabled — mirrors specs.common
      common: {
        type: [
          {
            icon: { type: mongoose.Schema.Types.ObjectId, ref: "icon" },
            enabled: { type: Boolean, default: true },
          },
        ],
        default: [],
      },
      // icons picked from the non-common master list, specific to this product
      specific: {
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: "icon" }],
        default: [],
      },
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

export const Spec =
  mongoose.models.spec || mongoose.model("spec", specSchema);

export const Icon =
  mongoose.models.icon || mongoose.model("icon", iconSchema);

export const Product =
  mongoose.models.product || mongoose.model("product", productSchema);

export const GeneratedQr =
  mongoose.models.generatedqr ||
  mongoose.model("generatedqr", generatedQrSchema);
