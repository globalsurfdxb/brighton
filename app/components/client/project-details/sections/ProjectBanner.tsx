"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";

export default function ProjectBanner({
  image,
  title,
}: {
  image: string;
  title: string;
}) {
  const router = useRouter();

  return (
    <div className="relative flex max-h-[800px] h-[90svh] w-full overflow-hidden">
      <Image src={image} alt={title} fill priority className="object-cover" />

      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(0, 0, 0, 0) 39%, rgba(0, 0, 0, 0.5) 83.56%)",
        }}
      />

      {/* Content wrapper */}
      <div className="relative container z-10 flex h-full w-full flex-col justify-between pt-200 3xl:pt-[206px] pb-90 min-[1850px]:pb-[94px]">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex w-fit items-center gap-2.5 text-white cursor-pointer max-h-[42px] px-[17px] py-2 border border-secondary rounded-[100px] group hover:bg-primary transition-colors duration-500"
        >
          <Image
            src="/assets/icons/arrow-left-white.svg"
            alt=""
            width={27}
            height={27}
            className="group-hover:-translate-x-1 transition-transform duration-500"
          />
          <span className="text-description-3 uppercase max-h-[11px] leading-none mb-[2px]">Back</span>
        </button>

        <h1 className="hero-title text-white">{title}</h1>
      </div>
    </div>
  );
}
