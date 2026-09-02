import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true },
    isHidden: { type: Boolean, default: false },
    seo: {
      metaTitle: { type: String },
      metaDescription: { type: String },
      script: { type: String },
    },
    homePageSection: {
      description: { type: String },
      image: { type: String },
      imageAlt: { type: String },
    },
    bannerSection: {
      isHidden: { type: Boolean, default: false },
      image: { type: String },
      imageAlt: { type: String },
      title: { type: String },
    },
    firstSection: {
      isHidden: { type: Boolean, default: false },
      title: { type: String },
      btnText: { type: String },
      btnLink: { type: String },
    },
    secondSection: {
      isHidden: { type: Boolean, default: false },
      title: { type: String },
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
    thirdSection: {
      isHidden: { type: Boolean, default: false },
      title: { type: String },
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
    fourthSection: {
      isHidden: { type: Boolean, default: false },
      title: { type: String },
      items: {
        type: [
          {
            title: { type: String },
            description: { type: String },
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
  },
  { timestamps: true },
);

export default mongoose.models.service ||
  mongoose.model("service", serviceSchema);
