"use client";

import AnimatedTitle from "../../animations/AnimatedTitle";
import PillBtn from "../../common/PillBtn";
import NewsCard from "./NewsCard";
import { motion } from "framer-motion";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMediaQuery } from "@/app/hooks/useMediaQuery";
import { useLoadMoreScroll } from "@/app/hooks/useLoadMoreScroll";
import CommonCategoryTabs from "../../common/CommonCategoryTabs";
import Reveal from "../../animations/RevealItemsOneByOneAnimation";
import { moveUpV2 } from "../../animations/motionVariants";

interface NewsListProps {
  data: {
    title: string;
    categories: string[];
    items: {
      id: number;
      title: string;
      date: string;
      category: string;
      image: string;
    }[];
  };
}

const LOAD_MORE_COUNT = 6;
const ALL_CATEGORY = "All";

const NewsList = ({ data }: NewsListProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const isDesktop = useMediaQuery(768);
  const initialVisibleCount = isDesktop ? 12 : 8;
  const selectedCategory = searchParams.get("category") || ALL_CATEGORY;

  const page = Number(searchParams.get("page") || "1");
  const currentPage = Number.isFinite(page) && page > 0 ? Math.floor(page) : 1;

  const updateParams = (nextParams: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(nextParams).forEach(([key, value]) => {
      if (!value) {
        params.delete(key);
        return;
      }

      params.set(key, value);
    });

    const queryString = params.toString();
    router.push(queryString ? `${pathname}?${queryString}` : pathname, {
      scroll: false,
    });
  };

  const handleCategoryClick = (category: string) => {
    updateParams({
      category: category === ALL_CATEGORY ? null : category,
      page: null,
    });
  };

  const filteredItems =
    selectedCategory === ALL_CATEGORY
      ? data.items
      : data.items.filter((item) => item.category === selectedCategory);

  const visibleCount =
    initialVisibleCount + (currentPage - 1) * LOAD_MORE_COUNT;
  const visibleItems = filteredItems.slice(0, visibleCount);
  const hasMoreItems =
    filteredItems.length > initialVisibleCount &&
    visibleItems.length < filteredItems.length;

  const { markPendingScroll, getRefForIndex } = useLoadMoreScroll(
    visibleItems.length,
  );

  return (
    <section className="top-spacing pb-100 overflow-hidden">
      <div className="container">
        <AnimatedTitle text={data.title} className="hero-title mb-100" />
        <div className="mb-60">
          <CommonCategoryTabs
            options={data.categories.map((cat) => ({ id: cat, label: cat }))}
            active={selectedCategory}
            allLabel="All"
            allId={ALL_CATEGORY}
            onChange={handleCategoryClick}
          />
        </div>

        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-30 gap-y-40 md:gap-y-80">
            {visibleItems.map((item, index) => (
              <Reveal
                variants={moveUpV2}
                delayRange={index * 0.08}
                key={item.id}
              >
                <div ref={getRefForIndex(index)}>
                  <NewsCard {...item} />
                </div>
              </Reveal>
            ))}
          </div>
        ) : (
          <div className="flex py-60">
            <p className="text-description-color text-subtitle">
              No news found.
            </p>
          </div>
        )}
        {hasMoreItems && (
          <motion.div className="flex justify-center mt-100">
            <PillBtn
              label={"Load More"}
              active={false}
              onClick={() => {
                markPendingScroll(visibleItems.length);
                updateParams({ page: String(currentPage + 1) });
              }}
              arrow={true}
            />
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default NewsList;
