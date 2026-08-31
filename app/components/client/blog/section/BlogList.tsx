"use client";

import AnimatedTitle from "../../animations/AnimatedTitle";
import PillBtn from "../../common/PillBtn";
import BlogCard from "./BlogCard";
import { motion } from "framer-motion";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useLoadMoreScroll } from "@/app/hooks/useLoadMoreScroll";
import CommonCategoryTabs from "../../common/CommonCategoryTabs";
import Reveal from "../../animations/RevealItemsOneByOneAnimation";
import { moveUpV2 } from "../../animations/motionVariants";

interface BlogListProps {
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

const INITIAL_VISIBLE_COUNT = 6;
const LOAD_MORE_COUNT = 6;
const ALL_CATEGORY = "All";

const getBlogCardSize = (index: number) => {
  const patternIndex = index % 4;
  return patternIndex === 0 || patternIndex === 3 ? "big" : "small";
};

const chunkItems = <T,>(items: T[], size: number) => {
  const chunks: T[][] = [];

  for (let index = 0; index < items.length; index += size) {
    chunks.push(items.slice(index, index + size));
  }

  return chunks;
};

const BlogList = ({ data }: BlogListProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

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
    INITIAL_VISIBLE_COUNT + (currentPage - 1) * LOAD_MORE_COUNT;
  const visibleItems = filteredItems.slice(0, visibleCount);
  const visibleRows = chunkItems(visibleItems, 2);

  const hasMoreItems =
    filteredItems.length > INITIAL_VISIBLE_COUNT &&
    visibleItems.length < filteredItems.length;

  const { markPendingScroll, getRefForIndex } = useLoadMoreScroll(
    visibleItems.length,
  );

  return (
    <section className="top-spacing pb-100 overflow-hidden">
      <div className="container">
        <AnimatedTitle text={data.title} className="hero-title mb-100" />
        <div className="mb-40">
          <CommonCategoryTabs
            options={data.categories.map((cat) => ({ id: cat, label: cat }))}
            active={selectedCategory}
            allLabel="All"
            allId={ALL_CATEGORY}
            onChange={handleCategoryClick}
          />
        </div>

        {filteredItems.length > 0 ? (
          <div
            key={selectedCategory}
            className="flex flex-col gap-y-40 md:gap-y-80 lg:gap-y-100"
          >
            {visibleRows.map((row, rowIndex) => (
              <Reveal
                variants={moveUpV2}
                key={`${selectedCategory}-${rowIndex}`}
                delayRange={rowIndex * 0.1}
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-40 md:gap-y-80 gap-x-30 lg:flex lg:flex-row lg:items-start lg:gap-x-100 2xl:gap-x-150 3xl:gap-x-[184px]">
                  {row.map((item, itemIndex) => {
                    const itemPosition = rowIndex * 2 + itemIndex;

                    return (
                      <div
                        key={item.id}
                        className="w-full lg:w-auto"
                        ref={getRefForIndex(itemPosition)}
                      >
                        <BlogCard
                          {...item}
                          size={getBlogCardSize(itemPosition)}
                        />
                      </div>
                    );
                  })}
                </div>
              </Reveal>
            ))}
          </div>
        ) : (
          <div className="flex py-60">
            <p className="text-description-color text-subtitle">
              No blogs found.
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

export default BlogList;
