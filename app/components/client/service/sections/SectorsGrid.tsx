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
  }
}
const SectorsGrid = ({ data }: SectorsGridProps) => {
  return ( 
    <section className="py-100 bg-cream-background">
      <div className="container">
        <AnimatedTitle text={data.title} className="section-title mb-40 " />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 3xl:grid-cols-4 gap-3 xl:gap-7.5">
          {data.items.map((item) => (
            <div key={item.id} className="flex justify-between border-t border-secondary pt-3 xl:pt-4 2xl:pt-6.5">
              <h3 className="text-subtitle text-description-color mb-2">{item.title}</h3>
             <Image src={item.icon} alt={item.title} width={100} height={100} className="h-6 xl:h-8 w-auto 2xl:h-40 object-contain" />
            </div>
          ))}
        </div>
      </div>
    </section>
   );
}
 
export default SectorsGrid;