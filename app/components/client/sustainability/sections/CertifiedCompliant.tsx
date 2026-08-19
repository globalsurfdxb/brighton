import Image from "next/image";
import { certifiedCompliantData } from "../data";
import AnimatedTitle from "../../animations/AnimatedTitle";

export default function CertifiedCompliant() {
  return (
    <section className="w-full py-100">
      <div className="container">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-80">
          <div className="relative w-[220px] h-[220px] 2xl:w-[265px] 2xl:h-[265px] shrink-0">
            <Image
              src={certifiedCompliantData.image}
              alt={certifiedCompliantData.imageAlt}
              fill
              className="object-contain"
            />
          </div>

          <div>
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
