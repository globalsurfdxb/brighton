"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import CustomButton from "../../common/CustomButton";
import AnimatedDivider from "../../animations/AnimatedDivider";
import AnimatedTitle from "../../animations/AnimatedTitle";
import SectionDescription from "../../animations/SectionDescription";
import { moveUp } from "../../animations/motionVariants";
import { Product } from "@/app/types/product";

function PhotometricGallery({
  items,
  onHoverChange,
}: {
  items: { src: string; alt: string; name: string }[];
  onHoverChange?: (hovering: boolean) => void;
}) {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const activeIndex = hoverIndex !== null ? hoverIndex : selectedIndex;

  if (!items.length) return null;

  return (
    <div
      className="absolute right-0 top-0 z-10 flex flex-col gap-[5px] p-3"
      onMouseEnter={() => onHoverChange?.(true)}
      onMouseLeave={() => onHoverChange?.(false)}
      onMouseMove={(e) => e.stopPropagation()}
    >
      {items.map((item, index) => (
        <div key={index} className="relative">
          <button
            type="button"
            onPointerEnter={(e) => {
              if (e.pointerType === "mouse") setHoverIndex(index);
            }}
            onPointerLeave={(e) => {
              if (e.pointerType === "mouse") {
                setHoverIndex((cur) => (cur === index ? null : cur));
              }
            }}
            onClick={() =>
              setSelectedIndex((cur) => (cur === index ? null : index))
            }
            className={`cursor-pointer flex flex-col items-center gap-2 rounded-[5px] border transition-colors duration-500 px-2 xl:px-4 py-2 ${
              activeIndex === index ? "border-primary" : "border-secondary"
            }`}
          >
            <span className="text-[12px] font-itc-medium text-description-color text-trim">
              {item.name}
            </span>
            <span className="relative h-6 w-6 sm:h-8 sm:w-8 shrink-0 overflow-hidden rounded-[5px]">
              <Image
                src={item.src || "/assets/images/placeholder.png"}
                alt={item.alt}
                fill
                className="pointer-events-none object-contain"
              />
            </span>
          </button>

          <AnimatePresence>
            {activeIndex === index && (
              <motion.div
                initial={{ opacity: 0, scale: 0.85, x: 10 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.85, x: 10 }}
                transition={{
                  opacity: { duration: 0.2, ease: "easeOut" },
                  scale: { type: "spring", stiffness: 400, damping: 15 },
                  x: { type: "spring", stiffness: 400, damping: 15 },
                }}
                style={{ willChange: "transform, opacity" }}
                className="pointer-events-none absolute right-[calc(100%+10px)] md:right-[calc(100%+15px)] top-0 z-20 h-[100px] w-[100px] 2xl:h-[140px] 2xl:w-[140px] origin-right overflow-hidden rounded-[10px] border border-secondary bg-white shadow-[0_12px_28px_rgba(0,0,0,0.18)]"
              >
                <Image
                  src={item.src || "/assets/images/placeholder.png"}
                  alt={item.alt}
                  fill
                  className="object-contain p-2"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}

export default function ProductBanner({ product }: { product: Product }) {
  const name = product.title;
  const subCategoryTitle = product.subCategory?.title ?? "";
  const categoryTitle = product.category?.title ?? "";
  const description = product.description;
  const images = product.images.length
    ? product.images.map((img) => ({
        src: img.image,
        alt: img.imageAlt || name,
      }))
    : [{ src: product.thumbImage, alt: product.thumbImageAlt || name }];
  const photometrics = product.photometrics.map((p) => ({
    src: p.image,
    alt: p.imageAlt || p.name || name,
    name: p.name,
  }));
  const specs = [
    ...product.specs.custom,
    ...product.specs.common
      .filter((c) => c.enabled)
      .sort((a, b) => a.spec.order - b.spec.order)
      .map((c) => c.spec.label),
  ];
  const [activeIndex, setActiveIndex] = useState(0);
  const [isZooming, setIsZooming] = useState(false);
  const [isGalleryHovered, setIsGalleryHovered] = useState(false);
  const [zoomOrigin, setZoomOrigin] = useState({ x: 50, y: 50 });

  const handleImageMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setZoomOrigin({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  return (
    <section className="w-full pt-[100px] xl:pt-[146px] container overflow-hidden">
      <div className="flex flex-col items-center gap-5 sm:gap-8 lg:flex-row lg:gap-15">
        {/* Left: Image gallery */}
        <div className="relative w-full lg:w-[110%] 3xl:w-[896px] overflow-hidden">
          <div
            className="relative aspect-[896/760] w-full overflow-hidden rounded-[10px] bg-cream-background cursor-zoom-in 3xl:h-[760px] 3xl:w-[896px]"
            onMouseEnter={() => setIsZooming(true)}
            onMouseMove={handleImageMouseMove}
            onMouseLeave={() => {
              setIsZooming(false);
              setZoomOrigin({ x: 50, y: 50 });
            }}
          >
            <AnimatePresence initial={false}>
              <motion.div
                key={activeIndex}
                className="absolute inset-0"
                initial={{ opacity: 0, scale: 1.12 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.94 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              >
                <Image
                  src={
                    images[activeIndex].src || "/assets/images/placeholder.png"
                  }
                  alt={images[activeIndex].alt}
                  fill
                  className="pointer-events-none object-cover transition-transform duration-400 ease-in-out"
                  style={{
                    transform:
                      isZooming && !isGalleryHovered
                        ? "scale(1.5)"
                        : "scale(1)",
                    transformOrigin: `${zoomOrigin.x}% ${zoomOrigin.y}%`,
                  }}
                  priority
                />
              </motion.div>
            </AnimatePresence>

            <PhotometricGallery
              items={photometrics}
              onHoverChange={setIsGalleryHovered}
            />
          </div>

          {/* Thumbnails */}
          <div className="absolute bottom-0 left-0 flex gap-[5px] p-2.5">
            {images.map((img, index) => (
              <motion.button
                variants={moveUp(0.1 * index)}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                key={index}
                type="button"
                onClick={() => setActiveIndex(index)}
                className={`cursor-pointer relative h-[50px] w-[60px] sm:h-[60px] sm:w-[70px] md:h-[80px] md:w-[90px] shrink-0 overflow-hidden rounded-[10px] bg-white transition-opacity duration-500 3xl:h-[100px] 3xl:w-[115px] ${
                  activeIndex === index ? "ring ring-secondary" : ""
                }`}
              >
                <Image
                  src={img.src || "/assets/images/placeholder.png"}
                  alt={img.alt}
                  fill
                  className="pointer-events-none object-cover"
                />
              </motion.button>
            ))}
          </div>
        </div>

        {/* Right: Content */}
        <div className="flex flex-col">
          <SectionDescription
            direction="y"
            className="text-subtitle-2 text-description-color uppercase mb-30 min-[1920px]:min-h-[19px]"
            text={`${subCategoryTitle} · ${categoryTitle} Lighting`}
          />
          <AnimatedTitle
            tag="h1"
            className="hero-title mb-30 xl:mb-60"
            text={name}
          />

          <SectionDescription
            text={description}
            direction="y"
            className="text-description-4 text-description-color mb-30 min-[1900px]:max-w-[80ch]"
          />

          <div className="flex lg:flex-nowrap gap-[5px] mb-50 md:max-w-[70%] lg:max-w-full">
            {specs.map((spec, i) => (
              <motion.div
                variants={moveUp(i * 0.03)}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                key={`${spec}-${i}`}
                className="flex flex-1 min-w-0 aspect-square 3xl:flex-none 3xl:w-[162px] 3xl:h-[162px] px-20 flex-col items-center justify-center rounded-[10px] bg-primary text-description-4 text-center text-white"
              >
                <span className="text-trim">{spec}</span>
              </motion.div>
            ))}
          </div>

          <motion.div
            variants={moveUp(0.1)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="flex flex-wrap items-center gap-[9px]"
          >
            <CustomButton
              variant="3"
              text="Configure Variant"
              link="#product-configuration"
              btnClass="w-fit"
              iconDirection="down"
            />
          </motion.div>
        </div>
      </div>

      <AnimatedDivider className="border-primary mt-100" />
    </section>
  );
}
