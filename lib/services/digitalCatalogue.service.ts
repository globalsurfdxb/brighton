import { unstable_cache } from "next/cache";
import connectDB from "@/lib/mongodb";
import DigitalCatalogue from "@/app/models/DigitalCatalogue";
import type { DigitalCatalogueDoc } from "@/app/types/digitalCatalogue";

export const getDigitalCataloguePage = unstable_cache(
  async (): Promise<DigitalCatalogueDoc | null> => {
    await connectDB();
    const doc = await DigitalCatalogue.findOne({}).lean();
    return doc ? (JSON.parse(JSON.stringify(doc)) as DigitalCatalogueDoc) : null;
  },
  ["digital-catalogue-page"],
  { tags: ["DigitalCatalogue"], revalidate: 3600 },
);
