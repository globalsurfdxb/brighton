import AnimatedDivider from "../../animations/AnimatedDivider";
import AnimatedTitle from "../../animations/AnimatedTitle";
import { Product, ProductSpecTableGroup } from "@/app/types/product";

function SpecGroup({ group }: { group: ProductSpecTableGroup }) {
  return (
    <div className="rounded-[10px]">
      <div className="mb-[14px] rounded-full bg-white px-30 py-3 sm:py-5 flex items-center">
        <AnimatedTitle text={group.title} className="text-subtitle text-trim" />
      </div>

      <div className="flex flex-col px-30">
        {group.items.map((row, i) => (
          <div key={row.key}>
            <div className="flex items-center justify-between py-4 md:py-[26px]">
              <span className="text-description-color text-description text-trim">
                {row.key}
              </span>
              <span className="text-description text-primary text-trim">
                {row.value}
              </span>
            </div>

            {i !== group.items.length - 1 && (
              <AnimatedDivider className="border-secondary" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function TechnicalSpecification({
  product,
}: {
  product: Product;
}) {
  const { title, items } = product.thirdSection;
  if (!items.length) return null;

  return (
    <section className="w-full bg-cream-background py-100">
      <div className="container">
        <AnimatedTitle text={title} className="mb-5 md:mb-40 section-title" />

        <div className="grid grid-cols-1 gap-x-30 gap-y-30 3xl:gap-y-[34px] md:grid-cols-2">
          {items.map((group) => (
            <SpecGroup key={group.title} group={group} />
          ))}
        </div>
      </div>
    </section>
  );
}
