"use client";

import { useMemo, useState, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { products, subcategories, categories } from "../data";
import ProductCard from "./ProductCard";
import SubCategoryTabs from "./SubCategoryTabs";
import PillBtn from "../../common/PillBtn";
import AnimatedTitle from "../../animations/AnimatedTitle";
import Reveal from "../../animations/RevealItemsOneByOneAnimation";
import { moveLeft, moveUpV2 } from "../../animations/motionVariants";
import { motion } from "framer-motion";

export function CategoryTabs({ active, onChange }: any) {
  return (
    <div className="flex gap-1.5">
      {categories.map((cat) => {
        const isActive = active === cat.id;
        return (
          <PillBtn
            key={cat.id}
            label={cat.label}
            active={isActive}
            onClick={() => onChange(cat.id)}
          />
        );
      })}
    </div>
  );
}

export default function Main() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [category, setCategory] = useState(
    () => searchParams.get("category") || "interior",
  );

  const categorySubcategories = useMemo(
    () => subcategories.filter((s) => s.category === category),
    [category],
  );

  const [subcategoryId, setSubcategoryId] = useState(() => {
    const fromUrl = searchParams.get("subcategory");
    const initialCategory = searchParams.get("category") || "interior";
    const validForCategory = subcategories.find(
      (s) => s.id === fromUrl && s.category === initialCategory,
    );
    return validForCategory
      ? fromUrl!
      : subcategories.find((s) => s.category === initialCategory)?.id ?? "";
  });

  const updateUrl = (nextCategory: string, nextSubcategory: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("category", nextCategory);
    params.set("subcategory", nextSubcategory);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const handleCategoryChange = (id: string) => {
    const firstSub = subcategories.find((s) => s.category === id)?.id ?? "";
    setCategory(id);
    setSubcategoryId(firstSub);
    updateUrl(id, firstSub);
  };

  const handleSubcategoryChange = (id: string) => {
    setSubcategoryId(id);
    updateUrl(category, id);
  };

  const filteredProducts = useMemo(
    () =>
      products.filter(
        (p) => p.category === category && p.subcategoryId === subcategoryId,
      ),
    [category, subcategoryId],
  );

  return (
    <section className="bg-white top-spacing pb-100 not-visited:overflow-hidden">
      <div className="container flex flex-col md:flex-row gap-40 items-center justify-between items-start">
        <AnimatedTitle
          key={`${category}`}
          tag="h1"
          className="hero-title"
          text={`${category === "interior" ? "Interior" : "Exterior"} Lighting`}
        />
        <motion.div
          variants={moveLeft(0.1)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          <CategoryTabs active={category} onChange={handleCategoryChange} />
        </motion.div>
      </div>

      <div className="container mt-5 md:mt-100">
        <SubCategoryTabs
          key={category}
          subcategories={categorySubcategories}
          active={subcategoryId}
          onChange={handleSubcategoryChange}
        />
      </div>

      {filteredProducts.length > 0 ? (
        <div className="container mt-7 sm:mt-60 grid grid-cols-1 sm:grid-cols-2 gap-y-60 gap-x-7.5 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
          {filteredProducts.map((product, index) => (
            <Reveal key={index} variants={moveUpV2} delayRange={index * 0.02}>
              <ProductCard product={product} />
            </Reveal>
          ))}
        </div>
      ) : (
        <div className="container flex py-60">
          <p className="text-description-color text-subtitle">
            No products found.
          </p>
        </div>
      )}
    </section>
  );
}