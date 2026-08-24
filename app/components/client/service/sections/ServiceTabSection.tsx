"use client";

import { useState } from "react";
import AnimatedTitle from "../../animations/AnimatedTitle";

interface ServiceTabSectionProps {
  data: {
    sectionTitle: string;
    items: {
      id: string;
      title: string;
      image: string;
      description: string;
    }[];
  };
}

const ArrowIcon = () => (
  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-black text-white">
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M2.5 9.5L9.5 2.5M9.5 2.5H4M9.5 2.5V8"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </span>
);

const ServiceTabSection = ({ data }: ServiceTabSectionProps) => {
  const items = data.items ?? [];
  const [activeId, setActiveId] = useState<string>(items[0]?.id ?? "");
  const [previousId, setPreviousId] = useState<string>(items[0]?.id ?? "");
  const [revealKey, setRevealKey] = useState(0);

  const activeItem = items.find((item) => item.id === activeId) ?? items[0];
  const previousItem = items.find((item) => item.id === previousId) ?? items[0];

  const mid = Math.ceil(items.length / 2);
  const columns = [items.slice(0, mid), items.slice(mid)];


  const handleSelect = (id: string) => {
    if (id === activeId) return;
    setPreviousId(activeId);
    setActiveId(id);
    setRevealKey((k) => k + 1);
  };

  return (
    <section className="py-100">
      <div className="container">
        <AnimatedTitle text={data.sectionTitle} className="section-title mb-3 xl:mb-40 mr-60" />
        <div className="grid grid-cols-1 md:grid-cols-[1fr_1.3fr] 2xl:grid-cols-2 min-[1650px]:grid-cols-[895px_auto] gap-6 xl:gap-10 3xl:gap-80">
          {/* Image (desktop / tablet only) */}
          <div className="relative hidden md:block">
            <div className="relative w-full rounded-[10px] overflow-hidden bg-gray-100 min-h-[300px] md:min-h-full xl:min-h-[calc(100%_+_50px)] 2xl:min-h-[calc(100%_+_50px)] 3xl:min-h-[720px] 3xl:h-[calc(100% + 158px)]">
              <img
                key={`base-${previousItem.id}`}
                src={previousItem.image}
                alt={previousItem.title}
                className="absolute inset-0 z-0 h-full w-full object-cover"
              />

              <img
                key={`reveal-${activeItem.id}-${revealKey}`}
                src={activeItem.image}
                alt={activeItem.title}
                onAnimationEnd={() => setPreviousId(activeId)}
                className="absolute inset-0 z-10 h-full w-full object-cover"
                style={{ animation: "revealLeft 700ms cubic-bezier(0.16,1,0.3,1) forwards" }}
              />
            </div>
          </div>

          {/* Right side */}
          <div className="flex flex-col xl:pt-40 3xl:pt-[70px]">
            {/* ---- Desktop / tablet: two-column tab list ---- */}
            <div className="hidden md:grid grid-cols-2 gap-x-4 xl:gap-x-5 3xl:gap-x-[45px] mb-4 2xl:mb-100 3xl:mb-[150px]">
              {columns.map((col, colIdx) => (
                <div key={colIdx} className="flex flex-col">
                  {col.map((item) => {
                    const isActive = activeItem?.id === item.id;
                    return (
                      <button key={item.id} type="button" onClick={() => handleSelect(item.id)}
                        className="group flex items-center justify-between gap-x-4 border-b border-secondary last:border-b-0 text-left transition-colors duration-300 3xl:pr-5 py-[8px] xl:py-[12px] first:pt-0" >
                        <span className={`text-subtitle-3 transition-colors duration-300 ${isActive ? "text-primary font-medium" : "text-description-color group-hover:text-primary" }`}>
                          {item.title}
                        </span>
                        <span className={`transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${isActive ? "opacity-100 -rotate-0" : "opacity-0 pointer-events-none" }`} >
                          <div className="flex h-7.5 w-7.5 shrink-0 items-center justify-center rounded-md bg-black text-white">
                            <img src="/assets/icons/right-top-arrow-secondary.svg" width={13.33} height={13.33} className="object-contain w-[13.33px] h-[13.33px]" alt="" />
                          </div>
                        </span>
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>

            {/* ---- Desktop / tablet: active description ---- */}
            <div className="hidden md:block">
              {activeItem && (
                <div key={activeItem.id} className="cap-fade">
                  <h3 className="text-subtitle mb-3 xl:mb-3 3xl:mb-6.5">
                    {activeItem.title}
                  </h3>
                  <p className="text-description-4 text-description-color max-w-[68ch] pl-0.5">
                    {activeItem.description}
                  </p>
                </div>
              )}
            </div>

            {/* ---- Mobile: accordion ---- */}
            <div className="md:hidden flex flex-col">
              {items.map((item) => {
                const isOpen = activeItem?.id === item.id;
                return (
                  <div key={item.id} className="border-b border-gray-200">
                    <button
                      type="button"
                      onClick={() => setActiveId(isOpen ? "" : item.id)}
                      className="flex w-full items-center justify-between gap-4 py-4 text-left"
                    >
                      <span
                        className={`text-base transition-colors duration-300 ${isOpen ? "text-black font-medium" : "text-gray-500"
                          }`}
                      >
                        {item.title}
                      </span>

                      <span
                        className={`shrink-0 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${isOpen ? "rotate-45" : "rotate-0"
                          }`}
                      >
                        <span className="flex h-6 w-6 items-center justify-center rounded-md bg-black text-white">
                          <svg
                            width="12"
                            height="12"
                            viewBox="0 0 12 12"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M6 1.5V10.5M1.5 6H10.5"
                              stroke="currentColor"
                              strokeWidth="1.4"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </span>
                      </span>
                    </button>

                    <div
                      className={`grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                        }`}
                    >
                      <div className="overflow-hidden">
                        <div className="pb-5 pr-2">
                          <div className="mb-4 aspect-[4/3] max-h-[30vh] w-full overflow-hidden rounded-xl bg-gray-100">
                            <img
                              src={item.image}
                              alt={item.title}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <p className="text-sm text-gray-500 leading-relaxed">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServiceTabSection;