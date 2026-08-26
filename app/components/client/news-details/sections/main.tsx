"use client";
import AnimatedDivider from "../../animations/AnimatedDivider";
import AnimatedTitle from "../../animations/AnimatedTitle";
import CustomButton from "../../common/CustomButton";
import Image from "next/image";
import PillBtn from "../../common/PillBtn";
import { formatDate } from "@/lib/utils/formatDate";

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
            <div className="flex justify-between items-center mb-30 xl:mr-150 min-[1900px]:mr-[254px]">
              <div>
                <p className="text-description-color text-subtitle-2">
                  {formatDate(data.date)}
                </p>
              </div>
              <div className="flex items-center max-h-7.5 border border-secondary rounded-full py-2.25 px-4.5">
                <span className="text-description-color text-subtitle-2 text-trim uppercase">
                  {data.category}
                </span>
              </div>
            </div>

            <div className="rounded-[10px] overflow-hidden">
              <Image
                src={data.heroImage}
                alt={data.title}
                width={1820}
                height={700}
                className="w-full object-cover aspect-[1820/900] min-h-[280px] max-h-[700px]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-[18%_auto] 3xl:grid-cols-[308px_auto] gap-y-30 xl:gap-y-0 gap-x-100 3xl:gap-x-[155px]">
            <div>
              <div className="hidden xl:flex xl:sticky xl:top-100 xl:h-fit flex-row justify-between xl:flex-col gap-4 xl:gap-[26px]">
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
                  <p className="text-subtitle-3 text-trim">{data.category}</p>
                </div>
              </div>
            </div>

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
