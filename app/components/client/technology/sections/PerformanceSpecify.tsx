// "use client";

// import { useState, useEffect } from "react";
// import Image from "next/image";
// import { motion } from "framer-motion";
// import { performanceSpecifyData } from "../data";
// import AnimatedTitle from "../../animations/AnimatedTitle";

// export default function PerformanceSpecify() {
//   const [activeIndex, setActiveIndex] = useState(1);

//   return (
//     <section className="w-full py-100 overflow-x-auto">
//       <div className="container">
//         <AnimatedTitle
//           text={performanceSpecifyData.title}
//           className="section-title mb-40"
//         />

//         <div className="flex divide-x divide-secondary border-x border-secondary">
//           {performanceSpecifyData.items.map((item, i) => {
//             const isActive = activeIndex === i;

//             return (
//               <div
//                 key={i}
//                 onMouseEnter={() => setActiveIndex(i)}
//                 className={`h-[362px] cursor-pointer flex flex-col overflow-hidden transition-[flex-grow, padding] duration-500 ease-in-out basis-0 min-w-[120px] ${
//                   isActive
//                     ? "grow-[1.8] md:grow-[2.5] xl:grow-[3.4105] px-40 3xl:px-60"
//                     : "grow-[1] px-20"
//                 }`}
//               >
//                 <p className="text-[13px] 3xl:text-16 font-itc-medium leading-[100%] tracking-[-0.01em] uppercase text-description-color text-nowrap mb-60">
//                   {item.title}
//                 </p>

//                 <motion.div
//                   animate={{
//                     width: isActive ? 70 : 50,
//                     height: isActive ? 70 : 50,
//                   }}
//                   transition={{ duration: 0.4, ease: "easeOut" }}
//                   className="rounded-[10px] bg-primary flex items-center justify-center shrink-0"
//                 >
//                   <Image
//                     src={item.icon}
//                     alt={item.title}
//                     width={50}
//                     height={50}
//                     className={`${isActive ? "h-10" : "h-[28.57px]"} object-contain w-auto transition-[height] duration-500 ease-in-out`}
//                   />
//                 </motion.div>

//                 <motion.div
//                   initial={false}
//                   animate={{
//                     height: isActive ? "auto" : 0,
//                     opacity: isActive ? 1 : 0,
//                   }}
//                   transition={{ duration: 0.3, ease: "easeOut" }}
//                   className="overflow-hidden mt-40"
//                 >
//                   <AnimatedTitle
//                     key={isActive.toString()}
//                     className="text-subtitle mb-[18px] whitespace-nowrap"
//                     text={item.title}
//                   />
//                   <p className="text-description-4 text-description-color">
//                     {item.description}
//                   </p>
//                 </motion.div>
//               </div>
//             );
//           })}
//         </div>
//       </div>
//     </section>
//   );
// }

"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { performanceSpecifyData } from "../data";
import AnimatedTitle from "../../animations/AnimatedTitle";
import { useMediaQuery } from "@/app/hooks/useMediaQuery";

export default function PerformanceSpecify() {
  const [activeIndex, setActiveIndex] = useState(1);
  const [openIndex, setOpenIndex] = useState(0);
  const isXl = useMediaQuery(1280);

  return (
    <section className="w-full py-100 overflow-x-auto">
      <div className="container">
        <AnimatedTitle
          text={performanceSpecifyData.title}
          className="section-title mb-5 sm:mb-40"
        />

        <div
          className={
            isXl
              ? "flex divide-x divide-secondary border-x border-secondary"
              : "grid grid-cols-1 gap-x-50 md:grid-cols-2 divide-y divide-secondary"
          }
        >
          {performanceSpecifyData.items.map((item, i) => {
            const isActive = activeIndex === i;
            const isOpen = openIndex === i;

            if (!isXl) {
              return (
                <div
                  key={i}
                  onClick={() => setOpenIndex(isOpen ? -1 : i)}
                  className="cursor-pointer flex flex-col overflow-hidden border-secondary px-20 py-30 w-full"
                >
                  <div className="flex items-center gap-4">
                    <div className="rounded-[10px] bg-primary flex items-center justify-center shrink-0 w-10 h-10 md:w-12.5 md:h-12.5">
                      <Image
                        src={item.icon}
                        alt={item.title}
                        width={50}
                        height={50}
                        className="h-6 md:h-[28.57px] object-contain w-auto"
                      />
                    </div>
                    <p className="text-subtitle-2 uppercase text-description-color">
                      {item.title}
                    </p>
                  </div>

                  <motion.div
                    initial={false}
                    animate={{
                      height: isOpen ? "auto" : 0,
                      opacity: isOpen ? 1 : 0,
                    }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="overflow-hidden"
                  >
                    <p className="text-description-4 text-description-color mt-20">
                      {item.description}
                    </p>
                  </motion.div>
                </div>
              );
            }

            return (
              <div
                key={i}
                onMouseEnter={() => setActiveIndex(i)}
                className={`h-[362px] cursor-pointer flex flex-col overflow-hidden transition-[flex-grow, padding] duration-500 ease-in-out basis-0 min-w-[120px] ${
                  isActive
                    ? "grow-[1.8] md:grow-[2.5] xl:grow-[3.4105] px-40 3xl:px-60"
                    : "grow-[1] px-20"
                }`}
              >
                <p className="text-[13px] 3xl:text-16 font-itc-medium leading-[100%] tracking-[-0.01em] uppercase text-description-color text-nowrap mb-60">
                  {item.title}
                </p>

                <motion.div
                  animate={{
                    width: isActive ? 70 : 50,
                    height: isActive ? 70 : 50,
                  }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="rounded-[10px] bg-primary flex items-center justify-center shrink-0"
                >
                  <Image
                    src={item.icon}
                    alt={item.title}
                    width={50}
                    height={50}
                    className={`${isActive ? "h-10" : "h-[28.57px]"} object-contain w-auto transition-[height] duration-500 ease-in-out`}
                  />
                </motion.div>

                <motion.div
                  initial={false}
                  animate={{
                    height: isActive ? "auto" : 0,
                    opacity: isActive ? 1 : 0,
                  }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="overflow-hidden mt-40"
                >
                  <AnimatedTitle
                    key={isActive.toString()}
                    className="text-subtitle mb-[18px] whitespace-nowrap"
                    text={item.title}
                  />
                  <p className="text-description-4 text-description-color">
                    {item.description}
                  </p>
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
