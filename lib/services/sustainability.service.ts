import { unstable_cache } from "next/cache";
import connectDB from "@/lib/mongodb";
import Sustainability from "@/app/models/Sustainability";
import type { SustainabilityDoc } from "@/app/types/sustainability";

export const getSustainabilityPage = unstable_cache(
  async (): Promise<SustainabilityDoc | null> => {
    await connectDB();
    const doc = await Sustainability.findOne({}).lean();
    return doc ? (JSON.parse(JSON.stringify(doc)) as SustainabilityDoc) : null;
  },
  ["sustainability-page"],
  { tags: ["Sustainability"], revalidate: 3600 },
);
