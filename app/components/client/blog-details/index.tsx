import Main from "./sections/Main";
import Cta from "../common/Cta";
import RecentContent from "../common/RecentContent";
import type { BlogItem } from "@/app/types/blogs";
import type { BlogCardItem } from "@/lib/services/blog.service";

const Index = ({
  item,
  category,
  recent,
}: {
  item: BlogItem;
  category: string;
  recent: BlogCardItem[];
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
        <RecentContent title="Recent Blogs" items={recent} hrefPrefix="blog" />
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
