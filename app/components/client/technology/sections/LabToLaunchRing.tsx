import Image from "next/image";
import { ringItems, sectionTitle, RingItem } from "../data";
import AnimatedTitle from "../../animations/AnimatedTitle";

// container reference: 892 x 756.5 (matches aspect-[892/756.5] wrapper below)
const CONTAINER_W = 892;
const CONTAINER_H = 756.5;

const px = (v: number, axis: "x" | "y") =>
  `${(v / (axis === "x" ? CONTAINER_W : CONTAINER_H)) * 100}%`;

type PointPosition = {
  // top row: edge offset (box corner) — no translate needed
  // bottom row: center offset (box center) — needs translate-x-1/2, box overflows edge
  top?: string;
  bottom?: string;
  left?: string;
  right?: string;
  centered?: boolean; // true = anchor is box center, apply translate-x-1/2
  textSide: "left" | "right";
};

const pointPositions: Record<string, PointPosition> = {
  "02": {
    top: px(22, "y"),
    left: px(10, "x"),
    centered: true,
    textSide: "left",
  },
  "03": {
    top: px(22, "y"),
    right: px(10, "x"),
    centered: true,
    textSide: "right",
  },
  "01": {
    bottom: px(220, "y"),
    left: px(-200, "x"),
    centered: true,
    textSide: "left",
  },
  "04": {
    bottom: px(220, "y"),
    right: px(-200, "x"),
    centered: true,
    textSide: "right",
  },
};

function RingPoint({ item }: { item: RingItem }) {
  const pos = pointPositions[item.id];
  const isLeft = pos.textSide === "left";

  const wrapperStyle: React.CSSProperties = {
    top: pos.top,
    bottom: pos.bottom,
    left: pos.left,
    right: pos.right,
  };

  // centered boxes anchor by their own center (overflow edge), so translate-x-1/2 pulls
  // them back by half width — same effect mirrored for left vs right anchor
  const translateClass = pos.centered
    ? pos.left !== undefined
      ? "-translate-x-1/2"
      : "translate-x-1/2"
    : "";

  return (
    <div
      className={`absolute flex items-start gap-5 md:gap-70 3xl:gap-[73px] ${translateClass}`}
      style={wrapperStyle}
    >
      {isLeft && (
        <div className="order-1 w-max max-w-[260px] 3xl:max-w-[350px] text-right">
          <h3 className="mb-2.5 text-subtitle">{item.title}</h3>
          <p className="text-description-4 text-description-color">
            {item.description}
          </p>
        </div>
      )}

      <div className="order-2 z-10 flex h-14 w-14 3xl:h-[70px] 3xl:w-[70px] flex-shrink-0 mt-[2px] items-center justify-center rounded-[5px] bg-primary text-trim text-subtitle text-secondary">
        {item.number}
      </div>

      {!isLeft && (
        <div className="order-3 w-max max-w-[260px] 3xl:max-w-[350px] text-left">
          <h3 className="mb-2.5 text-subtitle">{item.title}</h3>
          <p className="text-description-4 text-description-color">
            {item.description}
          </p>
        </div>
      )}
    </div>
  );
}

export default function LabToLaunchRing() {
  return (
    <section className="w-full bg-cream-background pt-100 min-[1800px]:pt-[93.5px] max-h-[849px]">
      <div className="relative mx-auto aspect-[892/756.5] w-full max-w-[700px] 3xl:max-w-[892px]">
        <div className="absolute inset-0 h-full w-full">
          <Image
            src="/assets/images/technology/ring.svg"
            alt="Lab to Launch Ring"
            fill
            className="object-contain"
          />
        </div>

        <div className="absolute bottom-[32%] 3xl:bottom-[259px] left-1/2 -translate-x-1/2 text-center">
          <AnimatedTitle
            className="section-title max-w-[20ch]"
            text={sectionTitle.title}
          />
        </div>

        {ringItems.map((item) => (
          <RingPoint key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}
