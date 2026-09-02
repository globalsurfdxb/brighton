import Image from "next/image";
import AnimatedDivider from "../../animations/AnimatedDivider";
import Link from "next/link";

export default function ProjectCard({
  project,
  heightClass,
}: {
  project: any;
  heightClass: string;
}) {
  return (
    <Link href={`/projects/${project.title.toLowerCase().replace(/ /g, "-")}`}>
      <div className="group cursor-pointer">
        <div
          className={`relative w-full overflow-hidden rounded-[10px] ${heightClass}`}
        >
          <Image
            src={project.image || "/assets/images/placeholder.png"}
            alt={project.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105 pointer-events-none"
          />
        </div>

        <div className="mt-5">
          <h3 className="text-subtitle">{project.title}</h3>

          <AnimatedDivider
            className="mt-2.5 mb-5 border-secondary"
            hoverColor="#0A0A0A"
          />

          <div className="flex items-center justify-between">
            <p className="text-description-3 text-description-color">
              {project.categoryLabel}
            </p>
            <p className="text-description-3 text-description-color pr-[8.3%]">
              {project.region}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}
