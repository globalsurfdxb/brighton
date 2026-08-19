import Image from "next/image";
import { socialsData } from "../data";
import AnimatedDivider from "../../animations/AnimatedDivider";
import Link from "next/link";

export default function Socials() {
  return (
    <section className="w-full">
      <div className="relative w-full h-[253px] md:h-[400px] 2xl:h-[500px] 3xl:h-[600px]">
        <Image
          src={socialsData.image}
          alt={socialsData.imageAlt}
          fill
          className="object-cover object-center"
        />
      </div>

      <div className="container py-100">
        <AnimatedDivider className="border-secondary" />
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-[62%_1fr] 3xl:grid-cols-[1078px_1fr]">
          {socialsData.socials.map((item, i) => (
            <div key={i}>
              <Link
                href={item.href}
                className="inline-flex items-end gap-[25px] py-[50px] cursor-pointer"
              >
                <p className="section-title text-trim">{item.title}</p>
                <Image
                  src={item.icon}
                  alt={item.title}
                  width={20}
                  height={20}
                />
              </Link>
              {i < socialsData.socials.length - 2 && (
                <AnimatedDivider className="border-secondary" />
              )}
            </div>
          ))}
        </div>
        <AnimatedDivider className="border-secondary" />
      </div>
    </section>
  );
}
