import Cta from "../common/Cta";
import BlogList from "./section/BlogList";
import type { BlogDoc } from "@/app/types/blogs";
import { toBlogCards } from "@/lib/services/blog.service";

const Index = ({ data }: { data: BlogDoc }) => {
  const cta = data.ctaSection;
  return (
    <>
      <BlogList
        data={{
          title: data.bannerSection?.title || "Blogs",
          categories: (data.topics ?? []).map((t) => t.title),
          items: toBlogCards(data),
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
