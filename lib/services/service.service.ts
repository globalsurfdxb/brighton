import { unstable_cache } from "next/cache";
import connectDB from "@/lib/mongodb";
import Service from "@/app/models/Services";
import type { ServiceDoc } from "@/app/types/services";

export const getServiceBySlug = unstable_cache(
  async (slug: string): Promise<ServiceDoc | null> => {
    await connectDB();
    const doc = await Service.findOne({ slug }).lean();
    return doc ? (JSON.parse(JSON.stringify(doc)) as ServiceDoc) : null;
  },
  ["service-page"],
  { tags: ["Services"], revalidate: 3600 },
);
