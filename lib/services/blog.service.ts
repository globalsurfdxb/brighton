import { unstable_cache } from "next/cache";
import connectDB from "@/lib/mongodb";
import Blogs from "@/app/models/Blogs";
import type { BlogDoc, BlogItem } from "@/app/types/blogs";

export const getBlogsPage = unstable_cache(
  async (): Promise<BlogDoc | null> => {
    await connectDB();
    const doc = await Blogs.findOne({}).lean();
    return doc ? (JSON.parse(JSON.stringify(doc)) as BlogDoc) : null;
  },
  ["blogs-page"],
  { tags: ["Blogs"], revalidate: 3600 },
);

export type BlogCardItem = {
  id: string;
  slug: string;
  title: string;
  date: string;
  category: string;
  image: string;
};

export function toBlogCards(doc: BlogDoc): BlogCardItem[] {
  const topicTitle = new Map(doc.topics.map((t) => [String(t._id), t.title]));
  return doc.blogs
    .filter((item) => !item.isHidden && item.slug)
    .map((item: BlogItem) => {
      const topicIds = ([] as string[]).concat(item.topic ?? []);
      return {
        id: item._id,
        slug: item.slug,
        title: item.title ?? "",
        date: item.date ? item.date.slice(0, 10) : "",
        category: topicTitle.get(String(topicIds[0])) ?? "",
        image: item.thumbImage ?? "",
      };
    });
}
