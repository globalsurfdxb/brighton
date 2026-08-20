import AnimatedDivider from "../../animations/AnimatedDivider";
import AnimatedTitle from "../../animations/AnimatedTitle";
import { Specification } from "../data";

function SpecGroup({ group }: { group: any }) {
  return (
    <div className="rounded-[10px]">
      <div className="mb-[14px] rounded-full bg-white px-30 py-3 sm:py-5 flex items-center">
        <AnimatedTitle text={group.label} className="text-subtitle text-trim" />
      </div>

      <div className="flex flex-col px-30">
        {group.rows.map((row: any, i: number) => (
          <div key={row.label}>
            <div className="flex items-center justify-between py-4 md:py-[26px]">
              <span className="text-description-color text-description text-trim">
                {row.label}
              </span>
              <span className="text-description text-primary text-trim">
                {row.value}
              </span>
            </div>

            {i !== group.rows.length - 1 && (
              <AnimatedDivider className="border-secondary" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function TechnicalSpecification() {
  return (
    <section className="w-full bg-cream-background py-100">
      <div className="container">
        <AnimatedTitle text={Specification.title} className="mb-5 md:mb-40 section-title" />

        <div className="grid grid-cols-1 gap-x-30 gap-y-30 3xl:gap-y-[34px] md:grid-cols-2">
          {Specification.groups.map((group) => (
            <SpecGroup key={group.id} group={group} />
          ))}
        </div>
      </div>
    </section>
  );
}
