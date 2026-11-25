import { unstable_cache } from "next/cache";
import connectDB from "@/lib/mongodb";
import News from "@/app/models/News";
import type { NewsDoc, NewsItem } from "@/app/types/news";

export const getNewsPage = unstable_cache(
  async (): Promise<NewsDoc | null> => {
    await connectDB();
    const doc = await News.findOne({}).lean();
    return doc ? (JSON.parse(JSON.stringify(doc)) as NewsDoc) : null;
  },
  ["news-page"],
  { tags: ["News"], revalidate: 3600 },
);

export type NewsCardItem = {
  id: string;
  slug: string;
  title: string;
  date: string;
  category: string;
  image: string;
};

export function toNewsCards(doc: NewsDoc): NewsCardItem[] {
  const topicTitle = new Map(doc.topics.map((t) => [String(t._id), t.title]));
  return doc.news
    .filter((item) => !item.isHidden && item.slug)
    .map((item: NewsItem) => {
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
