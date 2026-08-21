// "use client";

// import { useState } from "react";
// import Image from "next/image";
// import { motion, AnimatePresence } from "framer-motion";
// import AnimatedDivider from "../../animations/AnimatedDivider";

// export default function ProductCard({ product }: { product: any }) {
//   const [isHovered, setIsHovered] = useState(false);

//   return (
//     <div
//       className="group cursor-pointer"
//       onMouseEnter={() => setIsHovered(true)}
//       onMouseLeave={() => setIsHovered(false)}
//     >
//       <div className="relative flex h-[260px] items-center justify-center overflow-hidden rounded-[10px] bg-cream-background sm:h-[340px] md:h-[400px] lg:h-[430px] 3xl:h-[540px]">
//         {/* Base image — scales down on hover */}
//         <motion.div
//           className="absolute inset-0"
//           animate={{ scale: isHovered ? 0.77 : 1 }}
//           transition={{ duration: 0.8, ease: [0.65, 0, 0.35, 1] }}
//         >
//           <Image
//             src={product.image}
//             alt={product.title}
//             fill
//             className="object-contain"
//           />
//         </motion.div>

//         {/* Hover image — bottom-to-top reveal */}
//         <AnimatePresence>
//           {isHovered && product.hoverImage && (
//             <motion.div
//               className="absolute inset-0 rounded-t-2xl overflow-hidden"
//               initial={{ clipPath: "circle(0% at 50% 50%)", opacity: 0 }}
//               animate={{ clipPath: "circle(75% at 50% 50%)", opacity: 1 }}
//               exit={{ clipPath: "circle(0% at 50% 50%)", opacity: 0 }}
//               transition={{
//                 clipPath: { duration: 0.6, ease: [0.65, 0, 0.35, 1] },
//                 opacity: { duration: 0.4, ease: "easeInOut" },
//               }}
//             >

//               <motion.div
//                 className="relative h-full w-full"
//                 initial={{ scale: 1.15 }}
//                 animate={{ scale: 1 }}
//                 exit={{ scale: 1.15 }}
//                 transition={{ duration: 0.65, ease: [0.65, 0, 0.35, 1] }}
//               >
//                 <Image
//                   src={product.hoverImage}
//                   alt={product.title}
//                   fill
//                   className="object-cover"
//                 />

//                 <div
//                   className="pointer-events-none absolute inset-0"
//                   style={{
//                     background:
//                       "linear-gradient(180deg, rgba(0, 0, 0, 0) 43.24%, rgba(0, 0, 0, 0.25) 100%)",
//                   }}
//                 />
//               </motion.div>

//               <motion.div
//                 className="absolute left-30 bottom-30"
//                 initial={{ opacity: 0, y: 30, x: -30, scale: 0.6 }}
//                 animate={{ opacity: 1, y: 0, x: 0, scale: 1 }}
//                 exit={{ opacity: 0, y: 30, x: -30, scale: 0.6 }}
//                 transition={{
//                   type: "spring",
//                   stiffness: 200,
//                   damping: 9,
//                   mass: 1,
//                   delay: 0.15,
//                 }}
//               >
//                 <Image
//                   src="/assets/icons/right-top-arrow-white.svg"
//                   className="invert brightness-0"
//                   alt=""
//                   width={40}
//                   height={40}
//                 />
//               </motion.div>
//             </motion.div>
//           )}
//         </AnimatePresence>
//       </div>

//       <div className="mt-30">
//         <h3 className="text-subtitle">{product.title}</h3>
//         <AnimatedDivider
//           className="mt-2.5 mb-5 border-secondary"
//           hoverColor="#0A0A0A"
//         />
//         <p className="text-description-3 text-description-color">
//           {product.subtitle}
//         </p>
//       </div>
//     </div>
//   );
// }

"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useMotionTemplate,
  animate,
} from "framer-motion";
import AnimatedDivider from "../../animations/AnimatedDivider";
import Link from "next/link";

export default function ProductCard({
  product,
  bgColor = "bg-cream-background",
}: {
  product: any;
  bgColor?: string;
}) {
  const [isHovered, setIsHovered] = useState(false);

  const radius = useMotionValue(0);
  const feather = useMotionValue(0);

  const maskImage = useMotionTemplate`radial-gradient(circle at 50% 50%, black calc(${radius}% - ${feather}%), transparent ${radius}%)`;

  useEffect(() => {
    const duration = isHovered ? 0.6 : 0.4;
    const ease = [0.65, 0, 0.35, 1] as const;

    const radiusControls = animate(radius, isHovered ? 110 : 0, {
      duration,
      ease,
    });

    // feather rises then fully closes to 0 — blend only visible mid-transition
    const featherControls = animate(feather, [0, 22, 0], {
      duration,
      ease,
      times: [0, 0.5, 1],
    });

    return () => {
      radiusControls.stop();
      featherControls.stop();
    };
  }, [isHovered, radius, feather]);

  return (
    <Link
      href={`/interior-lighting/${product.title.toLowerCase().replace(/\s/g, "-")}`}
    >
      <div
        className="group cursor-pointer select-none"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div
          className={`relative flex h-[260px] items-center justify-center overflow-hidden rounded-[10px] ${bgColor} h-[316px] md:h-[400px] 2xl:h-[420px] 3xl:h-[540px]`}
        >
          {/* Base image — scales down on hover */}
          <motion.div
            className="absolute inset-0"
            animate={{ scale: isHovered ? 0.83 : 1 }}
            transition={{ duration: 0.7, ease: [0.65, 0, 0.35, 1] }}
          >
            <Image
              src={product.image}
              alt={product.title}
              fill
              className="object-contain pointer-events-none"
            />
          </motion.div>
          {/* Hover image — feathered reveal during motion, full solid image at rest */}
          {/* <AnimatePresence>
            {isHovered && product.hoverImage && (
              <motion.div
                className="absolute inset-0 rounded-t-2xl overflow-hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                style={{
                  WebkitMaskImage: maskImage,
                  maskImage: maskImage,
                  WebkitMaskRepeat: "no-repeat",
                  maskRepeat: "no-repeat",
                }}
              >
                <motion.div
                  className="relative h-full w-full"
                  initial={{ scale: 1.15 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 1.15 }}
                  transition={{ duration: 0.65, ease: [0.65, 0, 0.35, 1] }}
                >
                  <Image
                    src={product.hoverImage}
                    alt={product.title}
                    fill
                    className="object-cover pointer-events-none"
                  />
                  <div
                    className="pointer-events-none absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(180deg, rgba(0, 0, 0, 0) 43.24%, rgba(0, 0, 0, 0.25) 100%)",
                    }}
                  />
                </motion.div>
                <motion.div
                  className="absolute left-30 bottom-30"
                  initial={{ opacity: 0, y: 30, x: -30, scale: 0.6 }}
                  animate={{ opacity: 1, y: 0, x: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 30, x: -30, scale: 0.6 }}
                  transition={{
                    type: "spring",
                    stiffness: 200,
                    damping: 9,
                    mass: 1,
                    delay: 0.15,
                  }}
                >
                  <Image
                    src="/assets/icons/right-top-arrow-white.svg"
                    className="invert brightness-0 pointer-events-none"
                    alt=""
                    width={40}
                    height={40}
                  />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence> */}
          {/* Hover image — always mounted so next/image fetches it on card mount,
              not on first hover. Visibility is controlled by opacity, not mount state,
              so there's no fetch delay/glitch the first time someone hovers. */}
          {product.hoverImage && (
            <motion.div
              className="absolute inset-0 rounded-t-2xl overflow-hidden"
              animate={{ opacity: isHovered ? 1 : 0 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              style={{
                WebkitMaskImage: maskImage,
                maskImage: maskImage,
                WebkitMaskRepeat: "no-repeat",
                maskRepeat: "no-repeat",
                pointerEvents: isHovered ? "auto" : "none",
              }}
            >
              <motion.div
                className="relative h-full w-full"
                animate={{ scale: isHovered ? 1 : 1.15 }}
                transition={{ duration: 0.65, ease: [0.65, 0, 0.35, 1] }}
              >
                <Image
                  src={product.hoverImage}
                  alt={product.title}
                  fill
                  priority
                  className="object-cover pointer-events-none"
                />
                <div
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(0, 0, 0, 0) 43.24%, rgba(0, 0, 0, 0.25) 100%)",
                  }}
                />
              </motion.div>
              <AnimatePresence>
                {isHovered && (
                  <motion.div
                    className="absolute left-30 bottom-30"
                    initial={{ opacity: 0, y: 30, x: -30, scale: 0.6 }}
                    animate={{ opacity: 1, y: 0, x: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 30, x: -30, scale: 0.6 }}
                    transition={{
                      type: "spring",
                      stiffness: 200,
                      damping: 9,
                      mass: 1,
                      delay: 0.15,
                    }}
                  >
                    <Image
                      src="/assets/icons/right-top-arrow-white.svg"
                      className="invert brightness-0 pointer-events-none"
                      alt=""
                      width={40}
                      height={40}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
        <div className="mt-30">
          <h3 className="text-subtitle">{product.title}</h3>
          <AnimatedDivider
            className="mt-2.5 mb-2.5 md:mb-5 border-secondary"
            hoverColor="#0A0A0A"
          />
          <p className="text-description-3 text-description-color">
            {product.subtitle}
          </p>
        </div>
      </div>
    </Link>
  );
}
