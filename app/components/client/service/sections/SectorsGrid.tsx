import Image from "next/image";
import AnimatedTitle from "../../animations/AnimatedTitle";
import { StaticImport } from "next/dist/shared/lib/get-img-props";
import AnimatedDivider from "../../animations/AnimatedDivider";

interface SectorsGridProps {
  data: {
    title: string;
    items: Array<{
      id: string;
      title: string;
      icon: string | StaticImport;
    }>;
  };
}
const SectorsGrid = ({ data }: SectorsGridProps) => {
  return (
    <section className="py-100 bg-cream-background">
      <div className="container">
        <AnimatedTitle text={data.title} className="section-title mb-40" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-30 2xl:gap-x-[29px] gap-y-30 xl:gap-y-60 3xl:gap-y-[64px] pb-1">
          {data.items.map((item) => (
            <div key={item.id}>
              <AnimatedDivider className="border-secondary pb-3 lg:pb-5 2xl:pb-6.5" />
              <div className="flex justify-between items-center pr-20">
                <AnimatedTitle
                  text={item.title}
                  className="text-subtitle text-description-color text-trim"
                />
                <Image
                  src={item.icon || "/assets/images/placeholder.png"}
                  alt={item.title}
                  width={100}
                  height={100}
                  className="h-6 xl:h-8 w-auto 2xl:h-40 object-contain pointer-events-none"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SectorsGrid;
