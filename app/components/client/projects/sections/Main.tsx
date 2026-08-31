"use client";

import { useMemo } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

import ProjectCard from "./ProjectCard";
import PillBtn from "../../common/PillBtn";
import FilterSelectDropDown from "../../common/FilterDropdown";
import { categoryOptions, regionOptions, projects } from "../data";
import AnimatedTitle from "../../animations/AnimatedTitle";
import CommonCategoryTabs from "../../common/CommonCategoryTabs";
import { useMediaQuery } from "@/app/hooks/useMediaQuery";
import { useLoadMoreScroll } from "@/app/hooks/useLoadMoreScroll";
import { motion } from "framer-motion";
import { moveLeft, moveUpV2 } from "../../animations/motionVariants";
import Reveal from "../../animations/RevealItemsOneByOneAnimation";

function withRowMeta(items: any[]) {
  const sizes = [2, 3];
  const result: { item: any; colSpanClass: string; heightClass: string }[] = [];

  let i = 0;
  let rowIndex = 0;

  while (i < items.length) {
    const isOddRow = rowIndex % 2 === 0;
    const size = isOddRow ? sizes[0] : sizes[1];
    const rowItems = items.slice(i, i + size);

    rowItems.forEach((item) => {
      result.push({
        item,
        colSpanClass: isOddRow ? "2xl:col-span-3" : "2xl:col-span-2",
        heightClass: isOddRow
          ? "h-[280px] lg:h-[380px] 2xl:h-[560px]"
          : "h-[280px] lg:h-[380px] 2xl:h-[368px]",
      });
    });

    i += size;
    rowIndex++;
  }

  return result;
}

export default function ProjectsSection() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const isDesktop = useMediaQuery(768);
  const initialVisibleCount = isDesktop ? 10 : 6;
  const LOAD_MORE_COUNT = isDesktop ? 10 : 6;

  const category = searchParams.get("category") || "all";
  const region = searchParams.get("region");

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

  const handleCategoryClick = (id: string) => {
    updateParams({
      category: id === "all" ? null : id,
      page: null,
    });
  };

  const handleRegionChange = (value: string | null) => {
    updateParams({
      region: value,
      page: null,
    });
  };

  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      const matchesCategory = category === "all" || p.category === category;
      const matchesRegion = region === null || p.region === region;
      return matchesCategory && matchesRegion;
    });
  }, [category, region]);

  const visibleCount =
    initialVisibleCount + (currentPage - 1) * LOAD_MORE_COUNT;
  const visibleProjects = useMemo(
    () => filteredProjects.slice(0, visibleCount),
    [filteredProjects, visibleCount],
  );

  const hasMore =
    filteredProjects.length > initialVisibleCount &&
    visibleProjects.length < filteredProjects.length;

  const rowMeta = useMemo(
    () => withRowMeta(visibleProjects),
    [visibleProjects],
  );

  const { markPendingScroll, getRefForIndex } = useLoadMoreScroll(
    visibleProjects.length,
  );

  return (
    <section className="bg-white top-spacing pb-100 container overflow-hidden">
      <AnimatedTitle className="hero-title mb-100" text="Projects" tag="h1" />

      <div className="mb-40 gap-3 sm:gap-5 flex flex-col sm:flex-row items-start sm:items-center md:flex-wrap justify-between">
        <CommonCategoryTabs
          options={categoryOptions}
          active={category}
          allLabel="All"
          mobileAllLabel="Sectors"
          onChange={handleCategoryClick}
        />

        <motion.div
          variants={moveLeft(0.12)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="w-full md:w-fit"
        >
          <FilterSelectDropDown
            label="Region"
            options={regionOptions}
            value={region}
            onChange={handleRegionChange}
          />
        </motion.div>
      </div>

      {filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 gap-x-30 gap-y-60 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
          {rowMeta.map(({ item, colSpanClass, heightClass }, index) => (
            <Reveal
              delayRange={index * 0.08}
              variants={moveUpV2}
              key={item.id}
              ref={getRefForIndex(index)}
              className={colSpanClass}
            >
              <ProjectCard project={item} heightClass={heightClass} />
            </Reveal>
          ))}
        </div>
      ) : (
        <div className="flex py-60">
          <p className="text-description-color text-subtitle">
            No projects found.
          </p>
        </div>
      )}

      {hasMore && (
        <div className="mt-80 flex items-center justify-center">
          <PillBtn
            label="Load More"
            active={false}
            onClick={() => {
              markPendingScroll(visibleProjects.length);
              updateParams({ page: String(currentPage + 1) });
            }}
            arrow
          />
        </div>
      )}
    </section>
  );
}
