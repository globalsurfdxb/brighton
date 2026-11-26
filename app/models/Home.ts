import mongoose from "mongoose";

const logoSchema = new mongoose.Schema(
  { image: { type: String }, imageAlt: { type: String } },
  { _id: false },
);

const homeSchema = new mongoose.Schema({
  seo: {
    metaTitle: { type: String },
    metaDescription: { type: String },
    script: { type: String },
  },
  heroSection: {
    title: { type: String },
    description: { type: String },
    video: { type: String },
    poster: { type: String },
    buttons: {
      type: [{ text: { type: String }, link: { type: String } }],
      default: [],
    },
  },
  overviewSection: {
    isHidden: { type: Boolean, default: false },
    stats: {
      type: [
        {
          label: { type: String },
          value: { type: String },
          icon: { type: String },
          iconAlt: { type: String },
        },
      ],
      default: [],
    },
    cards: {
      type: [
        {
          title: { type: String },
          description: { type: String },
          buttonText: { type: String },
          buttonLink: { type: String },
          video: { type: String },
          poster: { type: String },
          posterAlt: { type: String },
        },
      ],
      default: [],
    },
  },
  trustedBySection: {
    isHidden: { type: Boolean, default: false },
    title: { type: String },
    logos: { type: [logoSchema], default: [] },
  },
  servicesSection: {
    isHidden: { type: Boolean, default: false },
    title: { type: String },
  },
  certifiedBySection: {
    isHidden: { type: Boolean, default: false },
    title: { type: String },
    logos: { type: [logoSchema], default: [] },
  },
  ctaSection: {
    isHidden: { type: Boolean, default: false },
    title: { type: String },
    description: { type: String },
    buttonText: { type: String },
    buttonLink: { type: String },
  },
});

if (process.env.NODE_ENV !== "production") delete mongoose.models.home;

export default mongoose.models.home || mongoose.model("home", homeSchema);
