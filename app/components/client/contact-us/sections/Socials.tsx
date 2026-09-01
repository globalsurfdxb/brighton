import { socialsData } from "../data";
import AnimatedDivider from "../../animations/AnimatedDivider";
import Link from "next/link";
import Tilt3DImage from "../../common/Tilt3DImage";
import Image from "next/image";
import Reveal from "../../animations/RevealItemsOneByOneAnimation";
import { moveUpV2 } from "../../animations/motionVariants";
import AnimatedTitle from "../../animations/AnimatedTitle";

export default function Socials() {
  return (
    <section className="w-full">
      <div className="relative w-full h-[253px] md:h-[400px] 2xl:h-[500px] 3xl:h-[600px] overflow-hidden">
        <Tilt3DImage
          src={socialsData.image}
          alt={socialsData.imageAlt}
          imgClassName="object-cover object-center"
          reveal
        />
      </div>

      <div className="container py-100">
        <AnimatedDivider className="border-secondary" />
        <div className="grid grid-cols-2 xl:grid-cols-[62%_1fr] 3xl:grid-cols-[1078px_1fr]">
          {socialsData.socials.map((item, i) => (
            <Reveal key={i} variants={moveUpV2} delayRange={i * 0.12}>
              <div>
                <Link
                  href={item.href}
                  className="inline-flex items-end gap-3 lg:gap-6.25 py-5 lg:py-50 cursor-pointer group"
                >
                  <AnimatedTitle
                    className="text-subtitle md:section-title text-trim group-hover:text-description-color transition-all duration-500 ease-in-out"
                    text={item.title}
                  />
                  <Image
                    src={item.icon}
                    alt={item.title}
                    width={20}
                    height={20}
                    className="w-auto h-4 md:h-5 group-hover:scale-120 transition-all duration-500 ease-in-out"
                  />
                </Link>
                {i < socialsData.socials.length - 2 && (
                  <AnimatedDivider className="border-secondary" />
                )}
              </div>
            </Reveal>
          ))}
        </div>
        <AnimatedDivider className="border-secondary" />
      </div>
    </section>
  );
}
