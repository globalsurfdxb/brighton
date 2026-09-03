import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
  seo: {
    metaTitle: { type: String },
    metaDescription: { type: String },
    script: { type: String },
  },
  bannerSection: {
    title: { type: String },
  },
  ctaSection: {
    isHidden: { type: Boolean, default: false },
    title: { type: String },
    description: { type: String },
    buttonText: { type: String },
    buttonLink: { type: String },
  },
  regions: {
    type: [
      {
        title: { type: String },
      },
    ],
    default: [],
  },
  sectors: {
    type: [
      {
        title: { type: String },
      },
    ],
    default: [],
  },
  projects: {
    type: [
      {
        isHidden: { type: Boolean, default: false },
        title: { type: String },
        slug: { type: String },
        featured: { type: Boolean, default: false },
        region: { type: mongoose.Schema.Types.ObjectId },
        sector: {
          type: [mongoose.Schema.Types.ObjectId],
          default: [],
        },
        thumbImage: { type: String },
        thumbImageAlt: { type: String },
        bannerImage: { type: String },
        bannerImageAlt: { type: String },
        images: {
          type: [
            {
              url: { type: String },
              alt: { type: String },
            },
          ],
          default: [],
        },
        contentTitle: { type: String },
        content: { type: String },
        ctaSection: {
          isHidden: { type: Boolean, default: false },
          title: { type: String },
          description: { type: String },
          buttonText: { type: String },
          buttonLink: { type: String },
        },
      },
    ],
    default: [],
  },
});

export default mongoose.models.project ||
  mongoose.model("project", projectSchema);
