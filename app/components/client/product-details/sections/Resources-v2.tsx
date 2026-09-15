import AnimatedTitle from "../../animations/AnimatedTitle";
import { ResourceCard } from "./ResourceCard-v2";
import Reveal from "../../animations/RevealItemsOneByOneAnimation";
import { moveUpV2 } from "../../animations/motionVariants";
import { Product } from "@/app/types/product";

function fileTypeFromLink(link: string): string {
  const ext = link.split(".").pop()?.split("?")[0] ?? "";
  return ext ? ext.toUpperCase().slice(0, 4) : "FILE";
}

export default function SpecifierResources({ product }: { product: Product }) {
  const tiles = (
    Array.isArray(product.fourthSection) ? product.fourthSection : []
  ).filter((tile) => tile.items.length > 0);
  if (!tiles.length) return null;

  return (
    <section className="w-full bg-white py-100">
      <div className="container">
        {tiles.map((tile, tileIndex) => {
          const alt = tileIndex % 2 === 1;
          return (
            <div key={tileIndex} className={tileIndex > 0 ? "mt-100" : ""}>
              <AnimatedTitle text={tile.title} className="mb-40 section-title" />

              <div className="grid grid-cols-1 md:grid-cols-2 3xl:grid-cols-3 gap-3 md:gap-30 3xl:gap-[29px]">
                {tile.items.map((item, index) => (
                  <Reveal
                    variants={moveUpV2}
                    delayRange={index * 0.01}
                    key={index}
                  >
                    <ResourceCard
                      item={{
                        href: item.link,
                        name: item.title,
                        fileType: fileTypeFromLink(item.link),
                        meta: item.size,
                        action: "Download",
                      }}
                      bgColor={alt ? "bg-cream-background" : "bg-white"}
                      btnBgColor={alt ? "bg-white" : "bg-transparent"}
                      textColor="text-foreground"
                      iconSrc={
                        alt
                          ? "/assets/icons/certificates/2.svg"
                          : "/assets/icons/certificates/1.svg"
                      }
                      arrowIcon={
                        alt
                          ? "/assets/icons/certificates/resource_plus.svg"
                          : "/assets/icons/certificates/resource_down_arrow.svg"
                      }
                      arrowSize={
                        alt
                          ? "h-3 w-3 xl:h-5 xl:w-5"
                          : "h-3 w-3 xl:h-[18px] xl:w-[18px] 3xl:h-5 3xl:w-5"
                      }
                    />
                  </Reveal>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
