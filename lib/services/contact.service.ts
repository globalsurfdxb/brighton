import { unstable_cache } from "next/cache";
import connectDB from "@/lib/mongodb";
import Contact from "@/app/models/Contact";
import type { ContactDoc } from "@/app/types/contact";

export const getContactPage = unstable_cache(
  async (): Promise<ContactDoc | null> => {
    await connectDB();
    const doc = await Contact.findOne({}).lean();
    return doc ? (JSON.parse(JSON.stringify(doc)) as ContactDoc) : null;
  },
  ["contact-page"],
  { tags: ["Contact"], revalidate: 3600 },
);
