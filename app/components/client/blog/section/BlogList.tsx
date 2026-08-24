"use client";

import AnimatedTitle from "../../animations/AnimatedTitle";
import PillBtn from "../../common/PillBtn";
import BlogCard from "./BlogCard";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useLayoutEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { useLenis } from "../../layout/LenisProvider";

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
    loadMoreText: string;
  };
}

const INITIAL_VISIBLE_COUNT = 6;
const LOAD_MORE_COUNT = 6;
const ALL_CATEGORY = "All";
const SCROLL_OFFSET = 120;
const noScrollAnchorStyle = { overflowAnchor: "none" } as CSSProperties;

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
  const { resize, scrollTo } = useLenis();
  const firstNewCardRef = useRef<HTMLDivElement | null>(null);
  const scrollFrameRef = useRef<number | null>(null);
  const [pendingScrollIndex, setPendingScrollIndex] = useState<number | null>(null);
  const [loadPage, setLoadPage] = useState(1);

  const selectedCategory = searchParams.get("category") || ALL_CATEGORY;

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
    router.push(queryString ? `${pathname}?${queryString}` : pathname, { scroll: false });
  };

  const handleCategoryClick = (category: string) => {
    setLoadPage(1);
    setPendingScrollIndex(null);

    updateParams({
      category: category === ALL_CATEGORY ? null : category,
    });
  };

  const filteredItems =
    selectedCategory === ALL_CATEGORY
      ? data.items
      : data.items.filter((item) => item.category === selectedCategory);

  const visibleCount = INITIAL_VISIBLE_COUNT + (loadPage - 1) * LOAD_MORE_COUNT;
  const visibleItems = filteredItems.slice(0, visibleCount);
  const visibleRows = chunkItems(visibleItems, 2);
  const hasMoreItems = filteredItems.length > INITIAL_VISIBLE_COUNT && visibleItems.length < filteredItems.length;

  useLayoutEffect(() => {
    if (pendingScrollIndex === null || !firstNewCardRef.current) return;

    if (scrollFrameRef.current) {
      window.cancelAnimationFrame(scrollFrameRef.current);
    }

    scrollFrameRef.current = window.requestAnimationFrame(() => {
      if (!firstNewCardRef.current) return;

      resize();
      scrollTo(firstNewCardRef.current, { offset: -SCROLL_OFFSET, immediate: true });
      setPendingScrollIndex(null);
      scrollFrameRef.current = null;
    });

    return () => {
      if (scrollFrameRef.current) {
        window.cancelAnimationFrame(scrollFrameRef.current);
        scrollFrameRef.current = null;
      }
    };
  }, [pendingScrollIndex, resize, scrollTo, visibleItems.length]);

  const handleLoadMore = () => {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }

    setPendingScrollIndex(visibleItems.length);
    setLoadPage((prevPage) => prevPage + 1);
  };

  return (
    <section className="mt-100 py-100" style={noScrollAnchorStyle}>
      <div className="container">
        <AnimatedTitle text={data.title} className="section-title mb-40 mr-60" />
        <div className="flex flex-wrap gap-4 mb-60">
          <PillBtn label="All Blogs" active={selectedCategory === ALL_CATEGORY} onClick={() => handleCategoryClick(ALL_CATEGORY)} />
          {data.categories.map((category, index) => (
            <PillBtn key={index} label={category} active={selectedCategory === category} onClick={() => handleCategoryClick(category)} />
          ))}
        </div>
          <motion.div
            key={selectedCategory}
            className="flex flex-col gap-y-50 md:gap-y-70 lg:gap-y-80 xl:gap-y-90 3xl:gap-y-[100px]"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
          >
            <AnimatePresence initial={false}>
              {visibleRows.map((row, rowIndex) => (
                <motion.div
                  key={`${selectedCategory}-${rowIndex}`}
                  className="flex flex-col gap-y-50 md:gap-y-70 lg:flex-row lg:items-start lg:gap-x-50 xl:gap-x-80 2xl:gap-x-120 3xl:gap-x-[184px]"
                  initial={{ opacity: 0, y: 22 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{
                    duration: 0.38,
                    delay: Math.min(rowIndex * 0.04, 0.12),
                    ease: [0.22, 1, 0.36, 1],
                    layout: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
                  }}
                >
                  {row.map((item, itemIndex) => {
                    const itemPosition = rowIndex * 2 + itemIndex;
                    const isFirstNewCard = itemPosition === pendingScrollIndex;

                    return (
                      <motion.div
                        key={item.id}
                        className="w-full lg:w-auto"
                        ref={(node) => {
                          if (isFirstNewCard) {
                            firstNewCardRef.current = node;
                          }
                        }}
                        initial={isFirstNewCard || itemPosition >= visibleItems.length - LOAD_MORE_COUNT ? { opacity: 0, y: 18 } : false}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.36, ease: [0.22, 1, 0.36, 1] }}
                      >
                        <BlogCard {...item} size={getBlogCardSize(itemPosition)} />
                      </motion.div>
                    );
                  })}
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        <AnimatePresence>
          {hasMoreItems && (
            <motion.div
              className="flex justify-center mt-100"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              <PillBtn
                label={data.loadMoreText}
                active={false}
                onClick={handleLoadMore}
                arrow={true}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default BlogList;
