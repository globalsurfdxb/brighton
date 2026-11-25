import { unstable_cache } from "next/cache";
import connectDB from "@/lib/mongodb";
import Technology from "@/app/models/Technology";
import type { TechnologyDoc } from "@/app/types/technology";

export const getTechnologyPage = unstable_cache(
  async (): Promise<TechnologyDoc | null> => {
    await connectDB();
    const doc = await Technology.findOne({}).lean();
    return doc ? (JSON.parse(JSON.stringify(doc)) as TechnologyDoc) : null;
  },
  ["technology-page"],
  { tags: ["Technology"], revalidate: 3600 },
);
