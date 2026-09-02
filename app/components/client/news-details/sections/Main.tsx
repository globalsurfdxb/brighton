"use client";

import AnimatedDivider from "../../animations/AnimatedDivider";
import AnimatedTitle from "../../animations/AnimatedTitle";
import Image from "next/image";
import { formatDate } from "@/lib/utils/formatDate";
import { motion } from "framer-motion";
import { moveLeft, moveRight, moveUp } from "../../animations/motionVariants";

export interface NewsDetails {
  title: string;
  date: string;
  category: string;
  heroImage: string;
  content: string;
}

const Main = ({ data }: { data: NewsDetails }) => {
  return (
    <section className="top-spacing pb-100">
      <div className="container">
        <div>
          <AnimatedTitle
            text={data.title}
            className="hero-title md:leading-[1.16666667] mb-40 2xl:max-w-[85%] 3xl:max-w-[70%]"
          />

          <div className=" mb-40 xl:mb-80">
            <div className="flex justify-between items-center mb-30 xl:mr-150 min-[1900px]:mr-[254px] overflow-hidden">
              <motion.div
                variants={moveRight(0.05)}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
              >
                <p className="text-description-color text-subtitle-2">
                  {formatDate(data.date)}
                </p>
              </motion.div>
              <motion.div
                variants={moveLeft(0.1)}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                className="flex items-center max-h-7.5 border border-secondary rounded-full py-2.25 px-4.5"
              >
                <span className="text-description-color text-subtitle-2 text-trim uppercase">
                  {data.category}
                </span>
              </motion.div>
            </div>

            <motion.div
              variants={moveUp(0.15)}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="rounded-[10px] overflow-hidden"
            >
              <Image
                src={data.heroImage || "/assets/images/placeholder.png"}
                alt={data.title}
                width={1820}
                height={700}
                className="w-full object-cover aspect-[1820/900] min-h-[280px] max-h-[700px] pointer-events-none"
              />
            </motion.div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-[18%_auto] 3xl:grid-cols-[308px_auto] gap-y-30 xl:gap-y-0 gap-x-100 3xl:gap-x-[155px]">
            <div>
              <div className="hidden xl:flex xl:sticky xl:top-100 xl:h-fit flex-row justify-between xl:flex-col gap-4 xl:gap-[26px]">
                <motion.div
                  variants={moveRight(0.15)}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true }}
                >
                  <h4 className="text-subtitle-2 uppercase text-description-color mb-[10px] 3xl:min-h-[19px]">
                    Published
                  </h4>
                  <p className="text-subtitle-3 text-trim">
                    {formatDate(data.date)}
                  </p>
                </motion.div>
                <AnimatedDivider className="hidden xl:block border-secondary" />
                <motion.div
                  variants={moveRight(0.22)}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true }}
                >
                  <h4 className="text-subtitle-2 uppercase text-description-color mb-[10px] 3xl:min-h-[19px]">
                    Topic
                  </h4>
                  <p className="text-subtitle-3 text-trim">{data.category}</p>
                </motion.div>
              </div>
            </div>

            <motion.div
              variants={moveUp(0.25)}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="news-content 2xl:mr-80 min-[1900px]:mr-[156px]"
              dangerouslySetInnerHTML={{ __html: data.content }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Main;
