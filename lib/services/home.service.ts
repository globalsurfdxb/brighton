import { unstable_cache } from "next/cache";
import connectDB from "@/lib/mongodb";
import Home from "@/app/models/Home";
import Service from "@/app/models/Services";
import type { HomeDoc, HomeServiceCard } from "@/app/types/home";

type ServiceLean = {
  slug: string;
  homePageSection?: {
    title?: string;
    description?: string;
    image?: string;
    imageAlt?: string;
  };
};

export const getHomePage = unstable_cache(
  async (): Promise<HomeDoc | null> => {
    await connectDB();
    const doc = await Home.findOne({}).lean();
    return doc ? (JSON.parse(JSON.stringify(doc)) as HomeDoc) : null;
  },
  ["home-page"],
  { tags: ["Home"], revalidate: 3600 },
);

export const getHomeServices = unstable_cache(
  async (): Promise<HomeServiceCard[]> => {
    await connectDB();
    const services = (await Service.find({ isHidden: { $ne: true } })
      .sort({ createdAt: -1, _id: -1 })
      .select("slug homePageSection")
      .lean()) as unknown as ServiceLean[];
    return services
      .filter((s) => s.homePageSection?.title && s.homePageSection?.image)
      .map((s) => ({
        title: s.homePageSection?.title ?? "",
        description: s.homePageSection?.description ?? "",
        image: s.homePageSection?.image ?? "",
        imageAlt: s.homePageSection?.imageAlt ?? "",
        link: `/services/${s.slug}`,
      }));
  },
  ["home-services"],
  { tags: ["Home", "Services"], revalidate: 3600 },
);
