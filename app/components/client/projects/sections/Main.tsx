"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";

import ProjectCard from "./ProjectCard";
import PillBtn from "../../common/PillBtn";
import FilterSelectDropDown from "../../common/FilterDropdown";
import { categoryOptions, regionOptions, projects } from "../data";
import AnimatedTitle from "../../animations/AnimatedTitle";

const PAGE_SIZE = 10;

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
  const searchParams = useSearchParams();

  const swiperRef = useRef<SwiperType | null>(null);

  const [category, setCategory] = useState(
    searchParams.get("category") || "all",
  );

  const [region, setRegion] = useState<string | null>(
    searchParams.get("region"),
  );
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const updateFiltersInUrl = (
    newCategory: string,
    newRegion: string | null,
  ) => {
    const params = new URLSearchParams(searchParams.toString());

    if (newCategory === "all") {
      params.delete("category");
    } else {
      params.set("category", newCategory);
    }

    if (!newRegion) {
      params.delete("region");
    } else {
      params.set("region", newRegion.toLowerCase().replace(",", ""));
    }

    const queryString = params.toString();

    router.push(queryString ? `?${queryString}` : "?", {
      scroll: false,
    });
  };

  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      const matchesCategory = category === "all" || p.category === category;
      const matchesRegion = region === null || p.region === region;
      return matchesCategory && matchesRegion;
    });
  }, [category, region]);

  // Reset pagination whenever the active filters change
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [category, region]);

  const visibleProjects = useMemo(
    () => filteredProjects.slice(0, visibleCount),
    [filteredProjects, visibleCount],
  );

  const rowMeta = useMemo(
    () => withRowMeta(visibleProjects),
    [visibleProjects],
  );

  const hasMore = visibleCount < filteredProjects.length;

  return (
    <section className="bg-white top-spacing pb-100 container overflow-hidden">
      <AnimatedTitle className="hero-title mb-100" text="Projects" tag="h1" />

      <div className="mb-40 gap-5 flex flex-col lg:flex-row items-start lg:items-center justify-between">
        <Swiper
          speed={800}
          slidesPerView="auto"
          spaceBetween={5}
          freeMode
          grabCursor
          allowTouchMove
          touchStartPreventDefault={false}
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
          }}
          className="w-full !overflow-visible"
        >
          {categoryOptions.map((cat, index) => (
            <SwiperSlide key={cat.id} className="!w-auto">
              <PillBtn
                label={cat.label}
                active={category === cat.id}
                onClick={() => {
                  setCategory(cat.id);
                  updateFiltersInUrl(cat.id, region);
                  swiperRef.current?.slideTo(index);
                }}
              />
            </SwiperSlide>
          ))}
        </Swiper>

        <div>
          <FilterSelectDropDown
            label="Region"
            options={regionOptions}
            value={region}
            onChange={(value) => {
              setRegion(value);
              updateFiltersInUrl(category, value);
            }}
          />
        </div>
      </div>

      {filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 gap-x-30 gap-y-60 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
          {rowMeta.map(({ item, colSpanClass, heightClass }) => (
            <div key={item.id} className={colSpanClass}>
              <ProjectCard project={item} heightClass={heightClass} />
            </div>
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
            onClick={() => setVisibleCount((prev) => prev + PAGE_SIZE)}
            arrow
          />
        </div>
      )}
    </section>
  );
}
