"use client";

import { useMemo, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import ProductCard from "./ProductCard-v2";
import SubCategoryTabs from "./SubCategoryTabs-v2";
import PillBtn from "../../common/PillBtn";
import AnimatedTitle from "../../animations/AnimatedTitle";
import Reveal from "../../animations/RevealItemsOneByOneAnimation";
import { moveLeft, moveUpV2 } from "../../animations/motionVariants";
import { motion } from "framer-motion";
import { GetProductsResult, Category, SubCategory } from "@/app/types/product";
import { slugify } from "@/lib/utils/slugify";

function categoryIdOf(subCategory: SubCategory): string {
  return typeof subCategory.category === "string"
    ? subCategory.category
    : subCategory.category?._id ?? "";
}

function categorySlugOf(category: Category): string {
  return category.slug || slugify(category.title);
}

function subCategorySlugOf(subCategory: SubCategory): string {
  return subCategory.slug || slugify(subCategory.title);
}

export function CategoryTabs({
  categories,
  active,
  onChange,
}: {
  categories: Category[];
  active: string;
  onChange: (id: string) => void;
}) {
  return (
    <div className="flex gap-1.5">
      {categories.map((cat) => (
        <PillBtn
          key={cat._id}
          label={cat.title}
          active={active === cat._id}
          onClick={() => onChange(cat._id)}
        />
      ))}
    </div>
  );
}

export default function Main({ data }: { data: GetProductsResult }) {
  const { categories, subCategories, products } = data;
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [category, setCategory] = useState(() => {
    const fromUrl = searchParams.get("category");
    const matched = categories.find((c) => categorySlugOf(c) === fromUrl);
    return matched?._id ?? categories[0]?._id ?? "";
  });

  const categorySubcategories = useMemo(
    () => subCategories.filter((s) => categoryIdOf(s) === category),
    [category, subCategories],
  );

  const [subcategoryId, setSubcategoryId] = useState(() => {
    const fromUrl = searchParams.get("subcategory");
    const initialCategory =
      categories.find((c) => categorySlugOf(c) === searchParams.get("category"))
        ?._id ?? categories[0]?._id;
    const validForCategory = subCategories.find(
      (s) => subCategorySlugOf(s) === fromUrl && categoryIdOf(s) === initialCategory,
    );
    return validForCategory
      ? validForCategory._id
      : (subCategories.find((s) => categoryIdOf(s) === initialCategory)
          ?._id ?? "");
  });

  const activeCategory = categories.find((c) => c._id === category);

  const updateUrl = (nextCategoryId: string, nextSubcategoryId: string) => {
    const nextCategory = categories.find((c) => c._id === nextCategoryId);
    const nextSubcategory = subCategories.find((s) => s._id === nextSubcategoryId);
    const params = new URLSearchParams(searchParams.toString());
    params.set("category", nextCategory ? categorySlugOf(nextCategory) : "");
    params.set(
      "subcategory",
      nextSubcategory ? subCategorySlugOf(nextSubcategory) : "",
    );
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const handleCategoryChange = (id: string) => {
    const firstSub =
      subCategories.find((s) => categoryIdOf(s) === id)?._id ?? "";
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
        (p) => p.category?._id === category && p.subCategory?._id === subcategoryId,
      ),
    [products, category, subcategoryId],
  );

  return (
    <section className="bg-white top-spacing pb-100 not-visited:overflow-hidden">
      <div className="container flex flex-col md:flex-row gap-40 items-center justify-between items-start">
        <AnimatedTitle
          key={category}
          tag="h1"
          className="hero-title"
          text={`${activeCategory?.title ?? ""} Lighting`}
        />
        <motion.div
          variants={moveLeft(0.1)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          <CategoryTabs
            categories={categories}
            active={category}
            onChange={handleCategoryChange}
          />
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
            <Reveal key={product._id} variants={moveUpV2} delayRange={index * 0.02}>
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
