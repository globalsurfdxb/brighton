import mongoose from "mongoose";

const blogsSchema = new mongoose.Schema({
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
  topics: {
    type: [
      {
        title: { type: String },
      },
    ],
    default: [],
  },
  blogs: {
    type: [
      {
        isHidden: { type: Boolean, default: false },
        title: { type: String },
        slug: { type: String },
        topic: {
          type: [mongoose.Schema.Types.ObjectId],
          default: [],
        },
        date: { type: Date },
        thumbImage: { type: String },
        thumbImageAlt: { type: String },
        bannerImage: { type: String },
        bannerImageAlt: { type: String },
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

export default mongoose.models.blogs || mongoose.model("blogs", blogsSchema);
