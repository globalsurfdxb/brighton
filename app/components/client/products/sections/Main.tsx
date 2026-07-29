"use client";

import { useMemo, useState } from "react";
import { products, subcategories, categories } from "../data";
import ProductCard from "./ProductCard";
import SubCategoryTabs from "./SubCategoryTabs";
import PillBtn from "../../common/PillBtn";

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
    <section className="bg-white pt-200 3xl:pt-[206px] pb-100 container">
      <div className="flex items-center justify-between items-start">
        <h1 className="hero-title">
          {category === "interior" ? "Interior" : "Exterior"} Lighting
        </h1>
        <CategoryTabs active={category} onChange={setCategory} />
      </div>

      <div className="mt-100">
        <SubCategoryTabs active={subcategoryId} onChange={setSubcategoryId} />
      </div>

      <div className="mt-60 grid grid-cols-2 gap-5 3xl:gap-7.5 md:grid-cols-3 2xl:grid-cols-4">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
