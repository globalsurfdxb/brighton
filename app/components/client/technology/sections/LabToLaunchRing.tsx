import Image from "next/image";
import {
  ringSteps,
  rowEllipse,
  viewBox,
  sectionTitle,
  RingStep,
} from "../data";
import AnimatedTitle from "../../animations/AnimatedTitle";

function getPointPercent(step: RingStep) {
  const { cx, cy, rx, ry } = rowEllipse[step.row];
  const rad = (step.angle * Math.PI) / 180;
  const x = cx + rx * Math.cos(rad);
  const y = cy + ry * Math.sin(rad);
  return {
    xPercent: (x / viewBox.width) * 100,
    yPercent: (y / viewBox.height) * 100,
  };
}

function RingPoint({ step }: { step: RingStep }) {
  const { xPercent, yPercent } = getPointPercent(step);
  const isLeft = step.textSide === "left";

  return (
    <div
      className="absolute"
      style={{ left: `${xPercent}%`, top: `${yPercent}%` }}
    >
      {/* number box - center sits exactly on the ring */}
      <div className="absolute left-1/2 top-1/2 z-10 flex h-[70px] w-[70px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-[5px] bg-primary text-trim text-subtitle text-secondary">
        {step.number}
      </div>

      {/* text block - responsive gap from box edge, content flow, capped width */}
      <div
        className={`absolute top-1/2 w-max \ -translate-y-1/2 ${
          isLeft
            ? "right-[calc(50%+55px)] text-right sm:right-[calc(50%+65px)] md:right-[calc(50%+80px)] lg:right-[calc(50%+95px)] xl:right-[calc(50%+108px)]"
            : "left-[calc(50%+55px)] text-left sm:left-[calc(50%+65px)] md:left-[calc(50%+80px)] lg:left-[calc(50%+95px)] xl:left-[calc(50%+108px)]"
        }`}
      >
        <h3 className="mb-2.5 text-subtitle">{step.title}</h3>
        <p className="max-w-[350px] text-description-4 text-description-color">
          {step.description}
        </p>
      </div>
    </div>
  );
}

export default function LabToLaunchRing() {
  return (
    <section className="w-full bg-cream-background pt-100 min-[1800px]:pt-[93.5px] max-h-[849px]">
      {/* ring wrapper - x: center, natural height drives section height */}
      <div className="relative mx-auto aspect-[892/756.5] w-full max-w-[892px]">
        <div className="absolute inset-0 h-full w-full">
          <Image
            src="/assets/images/technology/ring.svg"
            alt="Lab to Launch Ring"
            fill
            className="object-contain"
          />
        </div>

        {/* section title - x: center, y: bottom-259px */}
        <div className="absolute bottom-[259px] left-1/2 -translate-x-1/2 text-center">
          <AnimatedTitle className="section-title max-w-[20ch]" text={sectionTitle.title} />
        </div>

        {/* 4 points on ring */}
        {ringSteps.map((step) => (
          <RingPoint key={step.id} step={step} />
        ))}
      </div>
    </section>
  );
}
