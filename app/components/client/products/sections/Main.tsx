"use client";

import { useMemo, useState } from "react";
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
  const [category, setCategory] = useState("interior");
  const [subcategoryId, setSubcategoryId] = useState(subcategories[0].id);

  const filteredProducts = useMemo(
    () =>
      products.filter(
        (p) => p.category === category && p.subcategoryId === subcategoryId,
      ),
    [category, subcategoryId],
  );

  return (
    <section className="bg-white top-spacing pb-100 not-visited:overflow-hidden">
      <div className="container flex flex-col md:flex-row gap-5 items-center justify-between items-start">
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
          <CategoryTabs active={category} onChange={setCategory} />
        </motion.div>
      </div>

      <div className="container mt-4 md:mt-100">
        <SubCategoryTabs active={subcategoryId} onChange={setSubcategoryId} />
      </div>

      <div className="container mt-7 sm:mt-60 grid grid-cols-1 sm:grid-cols-2 gap-y-60 gap-x-7.5 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
        {filteredProducts.map((product, index) => (
          <Reveal key={index} variants={moveUpV2} delayRange={index * 0.02}>
            <ProductCard product={product} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
