import mongoose from "mongoose";

const aboutSchema = new mongoose.Schema({
  seo: {
    metaTitle: { type: String },
    metaDescription: { type: String },
    script: { type: String },
  },
  bannerSection: {
    isHidden: {
      type: Boolean,
      default: false,
    },
    image: { type: String },
    imageAlt: { type: String },
    title: { type: String },
  },
  firstSection: {
    isHidden: { type: Boolean, default: false },
    title: { type: String },
    description: { type: String },
    items: {
      type: [
        {
          value: { type: String },
          label: { type: String },
        },
      ],
      default: [],
    },
  },
  secondSection: {
    isHidden: { type: Boolean, default: false },
    Image: { type: String },
    ImageAlt: { type: String },
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
  thirdSection: {
    isHidden: { type: Boolean, default: false },
    title: { type: String },
    subTitle: { type: String },
    description: { type: String },
    image: { type: String },
    imageAlt: { type: String },
  },
  fourthSection: {
    isHidden: { type: Boolean, default: false },
    title: { type: String },
    items: {
      type: [
        {
          image: { type: String },
          imageAlt: { type: String },
          title: { type: String },
        },
      ],
      default: [],
    },
  },
  fifthSection: {
    isHidden: { type: Boolean, default: false },
    title: { type: String },
    description: { type: String },
    image: { type: String },
    imageAlt: { type: String },
  },
  sixthSection: {
    isHidden: { type: Boolean, default: false },
    title: { type: String },
    description: { type: String },
    image: { type: String },
    imageAlt: { type: String },
  },
  seventhSection: {
    isHidden: { type: Boolean, default: false },
    title: { type: String },
    description: { type: String },
    buttonText: { type: String },
    buttonLink: { type: String },
  },
});

export default mongoose.models.about || mongoose.model("about", aboutSchema);
