import mongoose from "mongoose";

const designPhilosophySchema = new mongoose.Schema({
  seo: {
    metaTitle: { type: String },
    metaDescription: { type: String },
    script: { type: String },
  },
  bannerSection: {
    image: { type: String },
    imageAlt: { type: String },
    title: { type: String },
  },
  firstSection: {
    isHidden: { type: Boolean, default: false },
    subTitle: { type: String },
    items: {
      type: [
        {
          title: { type: String },
          description: { type: String },
          image: { type: String },
          imageAlt: { type: String },
        },
      ],
      default: [],
    },
  },
  secondSection: {
    isHidden: { type: Boolean, default: false },
    title: { type: String },
    subTitle: { type: String },
    description: { type: String },
    items: {
      type: [
        {
          title: { type: String },
          icon: { type: String },
          iconAlt: { type: String },
        },
      ],
      default: [],
    },
  },
  ctaSection: {
    isHidden: { type: Boolean, default: false },
    title: { type: String },
    description: { type: String },
    buttonText: { type: String },
    buttonLink: { type: String },
  },
});

export default mongoose.models.designPhilosophy ||
  mongoose.model("designPhilosophy", designPhilosophySchema);
