import Image from "next/image";
import AnimatedTitle from "../animations/AnimatedTitle";

interface ImageDescriptionProps {
  data: {
    title: string;
    description: string;
    image: string;
    imageAlt: string;
  };
}

export default function ImageDescription({ data }: ImageDescriptionProps) {
  return (
    <section className="w-full py-100">
      <div className="container">
        <div className="flex flex-col lg:flex-row justify-between gap-80 items-center">
          {/* Left */}
          <div className="w-full lg:w-1/2 relative aspect-[895/640] 3xl:w-[895px] 3xl:h-[640px] rounded-[10px] overflow-hidden">
            <Image
              src={data.image}
              alt={data.imageAlt}
              fill
              className="object-cover object-center"
            />
          </div>

          {/* Right */}
          <div className="w-full lg:w-1/2 flex flex-col flex-1">
            <AnimatedTitle
              text={data.title}
              className="section-title mb-30"
            />
            <p className="text-description-4 text-description-color">
              {data.description}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
