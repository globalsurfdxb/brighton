"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import Image from "next/image";
import { useContainerInset } from "@/app/hooks/useContainerInset";
import AnimatedTitle from "../../animations/AnimatedTitle";

interface Logo {
  image: string;
}

function LogoItem({ image }: Logo) {
  return (
    <div className="shrink-0 flex items-center">
      <Image
        src={image}
        alt={"client-logo"}
        width={160}
        height={50}
        className="select-none w-auto max-w-[160px] h-8 lg:h-12.5 object-contain pointer-events-none"
      />
    </div>
  );
}

function InfiniteRow({ items }: { items: Logo[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const xRef = useRef(0);
  const setWidthRef = useRef(0);

  const duplicateCount = 4;
  const duplicated = Array.from({ length: duplicateCount }).flatMap(
    () => items,
  );

  useLayoutEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    setWidthRef.current = track.scrollWidth / duplicateCount;
    xRef.current = 0;
    gsap.set(track, { x: 0 });

    const speed = 0.5;

    const tick = () => {
      const setWidth = setWidthRef.current;
      if (!setWidth) return;

      xRef.current -= speed;

      if (xRef.current <= -setWidth) {
        xRef.current += setWidth;
      }

      gsap.set(track, { x: xRef.current });
    };

    gsap.ticker.add(tick);

    return () => {
      gsap.ticker.remove(tick);
    };
  }, [items]);

  return (
    <div className="overflow-hidden w-full">
      <div
        ref={trackRef}
        className="flex items-center gap-80 lg:gap-[120px] w-max will-change-transform"
      >
        {duplicated.map((item, index) => (
          <LogoItem key={`${index}`} {...item} />
        ))}
      </div>
    </div>
  );
}

export default function ClientsCorousal({
  data,
  className,
}: {
  data: any;
  className?: string;
}) {
  const { label, logos } = data;
  const inset = useContainerInset();

  return (
    <section className={`w-full ${className}`}>
      <div
        style={{ paddingLeft: inset }}
        className="flex flex-col lg:flex-row lg:items-center justify-center gap-6 lg:gap-140"
      >
        <AnimatedTitle
          tag="span"
          text={label}
          className="text-subtitle shrink-0"
        />
        <InfiniteRow items={logos} />
      </div>
    </section>
  );
}
