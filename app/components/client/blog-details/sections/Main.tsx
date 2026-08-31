"use client";

import AnimatedTitle from "../../animations/AnimatedTitle";
import Image from "next/image";
import AnimatedDivider from "../../animations/AnimatedDivider";
import { formatDate } from "@/lib/utils/formatDate";
import { SharePill } from "./SharePil";
import { motion } from "framer-motion";
import { moveLeft, moveRight } from "../../animations/motionVariants";

export interface BlogDetails {
  title: string;
  date: string;
  category: string;
  heroImage: string;
  content: string;
}

const Main = ({ data }: { data: BlogDetails }) => {
  return (
    <section className="top-spacing pb-100">
      <div className="container">
        <div>
          <div className="mb-100 grid grid-cols-1 xl:grid-cols-[1.3fr_1fr] min-[1900px]:grid-cols-[1049px_auto] gap-x-80 overflow-hidden">
            <motion.div
              variants={moveRight(0.1)}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
            >
              <Image
                src={data.heroImage}
                alt={data.title}
                width={1820}
                height={700}
                className="rounded-[10px] w-full object-cover aspect-[1820/900] min-h-[280px] h-auto xl:min-h-[600px] 3xl:min-h-[800px]"
              />
            </motion.div>
            <div className="flex md:justify-between">
              <div className="mt-40 xl:pt-80">
                <AnimatedTitle
                  text={data.title}
                  className="hero-title mb-40 xl:mb-80"
                />
                <div className="flex justify-between items-center">
                  <motion.p
                    variants={moveRight(0.1)}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                    className="text-subtitle-2 text-description-color"
                  >
                    {formatDate(data.date)}
                  </motion.p>
                  <motion.div
                    variants={moveLeft(0.15)}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                    className="flex items-center max-h-7.5 border border-secondary rounded-full py-2.25 px-4.5 xl:mr-50"
                  >
                    <span className="text-description-color text-subtitle-2 text-trim uppercase">
                      {data.category}
                    </span>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>

          <AnimatedDivider className="hidden xl:block border-secondary mb-40 xl:mb-80" />

          <div className="grid grid-cols-1 xl:grid-cols-[18%_auto] 3xl:grid-cols-[308px_auto] gap-y-50 xl:gap-y-0 gap-x-100 3xl:gap-x-[155px]">
            <div className="xl:sticky xl:top-100 xl:h-fit flex flex-row justify-between xl:flex-col">
              <div className="w-full flex justify-end xl:justify-start">
                <SharePill title={data.title} />
              </div>
              <div className="hidden xl:flex flex-col gap-4 xl:gap-[26px]">
                <div>
                  <h4 className="text-subtitle-2 uppercase text-description-color mb-[10px]">
                    Published
                  </h4>
                  <p className="text-subtitle-3 text-trim">
                    {formatDate(data.date)}
                  </p>
                </div>
                <AnimatedDivider className="hidden xl:block border-secondary" />
                <div>
                  <h4 className="text-subtitle-2 uppercase text-description-color mb-[10px]">
                    Topic
                  </h4>
                  <p className="text-subtitle-3">{data.category}</p>
                </div>
              </div>
            </div>

            <AnimatedDivider className="xl:hidden border-secondary" />
            <div
              className="news-content 2xl:mr-80 min-[1900]:mr-[156px]"
              dangerouslySetInnerHTML={{ __html: data.content }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Main;
