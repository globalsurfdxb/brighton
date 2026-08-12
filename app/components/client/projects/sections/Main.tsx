"use client";

import { useEffect, useMemo, useState } from "react";
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
        colSpanClass: isOddRow ? "xl:col-span-3" : "xl:col-span-2",
        heightClass: isOddRow
          ? "h-[300px] sm:h-[340px] lg:h-[380px] xl:h-[560px]"
          : "h-[300px] sm:h-[340px] lg:h-[380px] xl:h-[368px]",
      });
    });

    i += size;
    rowIndex++;
  }

  return result;
}

export default function ProjectsSection() {
  const [category, setCategory] = useState("all");
  const [region, setRegion] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

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
    <section className="bg-white pt-200 3xl:pt-[206px] pb-100 container">
      <AnimatedTitle className="hero-title mb-100" text="Projects" tag="h1" />

      <div className="mb-10 flex flex-wrap items-center justify-between">
        <div className="flex flex-wrap gap-[5px]">
          {categoryOptions.map((cat) => (
            <PillBtn
              key={cat.id}
              label={cat.label}
              active={category === cat.id}
              onClick={() => setCategory(cat.id)}
            />
          ))}
        </div>

        <div>
          <FilterSelectDropDown
            label="Region"
            options={regionOptions}
            value={region}
            onChange={setRegion}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-x-30 gap-y-60 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {rowMeta.map(({ item, colSpanClass, heightClass }) => (
          <div key={item.id} className={colSpanClass}>
            <ProjectCard project={item} heightClass={heightClass} />
          </div>
        ))}
      </div>

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