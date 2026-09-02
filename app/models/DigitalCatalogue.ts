import mongoose from "mongoose";

const digitalCatalogueSchema = new mongoose.Schema({
  seo: {
    metaTitle: { type: String },
    metaDescription: { type: String },
    script: { type: String },
  },
  firstSection: {
    isHidden: { type: Boolean, default: false },
    title: { type: String },
    subTitle: { type: String },
    catalogueText: { type: String },
    catalogueLink: { type: String },
    image: { type: String },
    imageAlt: { type: String },
  },
  ctaSection: {
    isHidden: { type: Boolean, default: false },
    title: { type: String },
    description: { type: String },
    buttonText: { type: String },
    buttonLink: { type: String },
  },
});

export default mongoose.models.digitalCatalogue ||
  mongoose.model("digitalCatalogue", digitalCatalogueSchema);
