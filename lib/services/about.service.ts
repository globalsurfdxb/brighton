import { unstable_cache } from "next/cache";
import connectDB from "@/lib/mongodb";
import About from "@/app/models/About";
import type { AboutDoc } from "@/app/types/about";

export const getAboutPage = unstable_cache(
  async (): Promise<AboutDoc | null> => {
    await connectDB();
    const doc = await About.findOne({}).lean();
    return doc ? (JSON.parse(JSON.stringify(doc)) as AboutDoc) : null;
  },
  ["about-page"],
  { tags: ["About"], revalidate: 3600 },
);
