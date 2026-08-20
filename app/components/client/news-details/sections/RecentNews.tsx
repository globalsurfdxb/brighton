import AnimatedTitle from "../../animations/AnimatedTitle";
import { recentNews } from "../data";
import NewsCard from "@/app/components/client/news/section/NewsCard";

const RecentNews = () => {
  return (
    <section className="py-100 bg-cream-background">
      <div className="container">
        <AnimatedTitle text={recentNews.title} className="section-title mb-40 max-w-[60ch]" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-7.5 gap-y-5 xl:gap-y-40 2xl:gap-y-80">
          {
            recentNews.items.map((item) => (
              <NewsCard key={item.id} {...item} />
            ))
          }
        </div>
      </div>
    </section>
  );
}

export default RecentNews;