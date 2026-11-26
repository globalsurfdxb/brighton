import mongoose from "mongoose";

const linkSchema = new mongoose.Schema(
  { label: { type: String }, link: { type: String } },
  { _id: false },
);

const headerFooterSchema = new mongoose.Schema({
  header: {
    logo: { type: String },
    logoAlt: { type: String },
    navItems: {
      type: [
        {
          label: { type: String },
          link: { type: String },
          items: { type: [linkSchema], default: [] },
        },
      ],
      default: [],
    },
    buttonText: { type: String },
    buttonLink: { type: String },
  },
  footer: {
    columns: {
      type: [
        {
          title: { type: String },
          links: { type: [linkSchema], default: [] },
        },
      ],
      default: [],
    },
    address: { type: String },
    addressLink: { type: String },
    phone: { type: String },
    email: { type: String },
    socials: { type: [linkSchema], default: [] },
    catalogueButtonText: { type: String },
    copyright: { type: String },
    legalLinks: { type: [linkSchema], default: [] },
  },
});

if (process.env.NODE_ENV !== "production") delete mongoose.models.headerFooter;

export default mongoose.models.headerFooter ||
  mongoose.model("headerFooter", headerFooterSchema);
