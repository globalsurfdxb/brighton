import Main from "./sections/Main";
import Cta from "../common/Cta";
import RecentContent from "../common/RecentContent";
import type { NewsItem } from "@/app/types/news";
import type { NewsCardItem } from "@/lib/services/news.service";

const Index = ({
  item,
  category,
  recent,
}: {
  item: NewsItem;
  category: string;
  recent: NewsCardItem[];
}) => {
  const cta = item.ctaSection;
  return (
    <>
      <Main
        data={{
          title: item.title ?? "",
          date: item.date ? item.date.slice(0, 10) : "",
          category,
          heroImage: item.bannerImage ?? "",
          content: item.content ?? "",
        }}
      />
      {recent.length > 0 && (
        <RecentContent title="Recent News" items={recent} hrefPrefix="news" />
      )}
      {cta && !cta.isHidden && (
        <Cta
          data={{
            title: cta.title ?? "",
            description: cta.description ?? "",
            button: { text: cta.buttonText ?? "", href: cta.buttonLink || "#" },
          }}
        />
      )}
    </>
  );
};

export default Index;
