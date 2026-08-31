import Image from "next/image";
import { certifiedCompliantData } from "../data";
import AnimatedTitle from "../../animations/AnimatedTitle";

export default function CertifiedCompliant() {
  return (
    <section className="w-full py-100">
      <div className="container">
        <div className="flex flex-col sm:flex-row items-start md:items-center gap-30 lg:gap-80">
          <div className="relative w-[120px] h-[120px] sm:w-[160px] sm:h-[160px] md:w-[220px] md:h-[220px] 2xl:w-[265px] 2xl:h-[265px] shrink-0 order-2 sm:order-1">
            <Image
              src={certifiedCompliantData.image}
              alt={certifiedCompliantData.imageAlt}
              fill
              className="object-contain"
            />
          </div>

          <div className="order-1">
            <AnimatedTitle
              text={certifiedCompliantData.title}
              className="section-title mb-30"
            />
            <div
              className="text-description-4 text-description-color max-w-[120ch]"
              dangerouslySetInnerHTML={{
                __html: certifiedCompliantData.description,
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
