"use client";
import AnimatedTitle from "../../animations/AnimatedTitle";
import PillBtn from "../../common/PillBtn";
import NewsCard from "./NewsCard";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

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
    loadMoreText: string;
  };
}

const INITIAL_VISIBLE_COUNT = 12;
const LOAD_MORE_COUNT = 6;
const ALL_CATEGORY = "All";

const NewsList = ({ data }: NewsListProps) => {
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
    router.push(queryString ? `${pathname}?${queryString}` : pathname, { scroll: false });
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

  const visibleCount = INITIAL_VISIBLE_COUNT + (currentPage - 1) * LOAD_MORE_COUNT;
  const visibleItems = filteredItems.slice(0, visibleCount);
  const hasMoreItems = filteredItems.length > INITIAL_VISIBLE_COUNT && visibleItems.length < filteredItems.length;

  return ( 
    <section className="mt-100 py-100">
      <div className="container">
        <AnimatedTitle text={data.title} className="section-title mb-40 mr-60" />
        <div className="flex flex-wrap gap-4 mb-60">
          <PillBtn label="All News" active={selectedCategory === ALL_CATEGORY} onClick={() => handleCategoryClick(ALL_CATEGORY)} />
            {
              data.categories.map((category, index) => (
                <PillBtn key={index} label={category} active={selectedCategory === category} onClick={() => handleCategoryClick(category)} />
              ))
            }
        </div>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            layout
            key={selectedCategory}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-7.5 gap-y-5 xl:gap-y-40 2xl:gap-y-80"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
          >
            <AnimatePresence initial={false}>
              {visibleItems.map((item, index) => (
                <motion.div
                  layout="position"
                  key={item.id}
                  initial={{ opacity: 0, y: 22 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{
                    duration: 0.38,
                    delay: Math.min(index * 0.025, 0.12),
                    ease: [0.22, 1, 0.36, 1],
                    layout: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
                  }}
                >
                  <NewsCard {...item} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </AnimatePresence>
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
                onClick={() => updateParams({ page: String(currentPage + 1) })}
                arrow={true}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
   );
}
 
export default NewsList;
