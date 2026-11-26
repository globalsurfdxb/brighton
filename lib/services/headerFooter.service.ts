import { unstable_cache } from "next/cache";
import connectDB from "@/lib/mongodb";
import HeaderFooter from "@/app/models/HeaderFooter";
import type { HeaderFooterDoc } from "@/app/types/headerFooter";

export const getHeaderFooter = unstable_cache(
  async (): Promise<HeaderFooterDoc | null> => {
    await connectDB();
    const doc = await HeaderFooter.findOne({}).lean();
    return doc ? (JSON.parse(JSON.stringify(doc)) as HeaderFooterDoc) : null;
  },
  ["header-footer"],
  { tags: ["HeaderFooter"], revalidate: 3600 },
);
