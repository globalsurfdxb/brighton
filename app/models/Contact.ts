import mongoose from "mongoose";

const contactSchema = new mongoose.Schema({
  seo: {
    metaTitle: { type: String },
    metaDescription: { type: String },
    script: { type: String },
  },
  firstSection: {
    isHidden: { type: Boolean, default: false },
    title: { type: String },
    address: { type: String },
    addressLink: { type: String },
    phone: { type: String },
    email: { type: String },
    subTitle: { type: String },
    mapLink: { type: String },
  },
  secondSection: {
    isHidden: { type: Boolean, default: false },
    image: { type: String },
    imageAlt: { type: String },
    items: {
      type: [
        {
          title: { type: String },
          link: { type: String },
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

if (process.env.NODE_ENV !== "production") delete mongoose.models.contact;

export default mongoose.models.contact ||
  mongoose.model("contact", contactSchema);
