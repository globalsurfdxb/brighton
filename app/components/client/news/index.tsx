import Cta from "../common/Cta";
import NewsList from "./section/NewsList";
import type { NewsDoc } from "@/app/types/news";
import { toNewsCards } from "@/lib/services/news.service";

const Index = ({ data }: { data: NewsDoc }) => {
  const cta = data.ctaSection;
  return (
    <>
      <NewsList
        data={{
          title: data.bannerSection?.title || "News & Stories",
          categories: (data.topics ?? []).map((t) => t.title),
          items: toNewsCards(data),
        }}
      />
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
