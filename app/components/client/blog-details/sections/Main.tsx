"use client";

import AnimatedTitle from "../../animations/AnimatedTitle";
import CustomButton from "../../common/CustomButton";
import Image, { StaticImageData } from "next/image";
import { socialShareLinks } from "../data";

export interface BlogDetails {
  title: string;
  date: string;
  category: string;
  heroImage: string | StaticImageData;
  intro: string;
  content: Array<
    {
      type: "heading main";
      text: string;
    }
    | {
      type: "first two paragraph";
      introData: string[];
    }
    | {
      type: "paragraph" | "heading";
      text: string;
    }
    | {
      type: "image";
      src: string;
      alt: string;
    }
    | {
      type: "list";
      items: string[];
    }
  >;
}

const SharePill = ({ title }: { title: string }) => {
  const handleShare = (getHref: (url: string, text: string) => string) => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(title);

    window.open(getHref(url, text), "_blank", "noopener,noreferrer");
  };

  return (
    <div className="mb-40 inline-flex  w-fit items-center rounded-full border border-secondary pl-2 pr-2.5 xl:pl-4 3xl:pl-7.5 py-2">
      <span className="text-subtitle-2 uppercase text-description-color">Share</span>
      <div className="ml-4 xl:ml-6 3xl:ml-16.25 flex items-center gap-[6px]">
        {socialShareLinks.map((link) => (
          <button
            key={link.label}
            type="button"
            onClick={() => handleShare(link.getHref)}
            aria-label={`Share on ${link.label}`}
            className={`flex size-[48px] items-center justify-center rounded-full border border-secondary transition-colors duration-300 hover:bg-primary ${link.className}`}
          >
            <Image src={link.icon} alt="" width={24} height={24} className="size-6" aria-hidden />
          </button>
        ))}
      </div>
    </div>
  );
};

const Main = ({ data }: { data: BlogDetails }) => {
  return (
    <section className="mt-100 py-100">
      <div className="container">
        <div>
          
          <div className="mb-80 grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-[1.2fr_1fr] min-[1920px]:grid-cols-[1049px_auto] gap-x-4 xl:gap-x-6 2xl:gap-x-8 3xl:gap-x-10 min-[1536px]:gap-x-80 ">
            <div>
              <Image
                src={data.heroImage}
                alt={data.title}
                width={1820}
                height={700}
                className="rounded-[10px] w-full object-cover h-auto xl:min-h-[600px] 2xl:min-h-[700] 3xl:min-h-[800px]"
              />
            </div>
            <div className="flex md:justify-between mb-4 xl:mb-7.5 3xl:max-w-[1566px]">
              <div className="pt-3 2xl:pt-5 3xl:pt-80">
                <AnimatedTitle text={data.title} className="section-title mb-40 3xl:mb-80 max-w-[60ch] " />
              <div className="flex justify-between items-center">
                <p>Published on: {data.date}</p>
                <CustomButton text={data.category} variant="2" showIcon={false} />
              </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 xl:grid-cols-[309px_auto] gap-x-40 3xl:gap-x-[155px]">
            <div>
              <div className="xl:sticky xl:top-100 xl:h-fit">
                <SharePill title={data.title} />
                <div className="border-b border-secondary pb-3 xl:pb-6.5 mb-3 xl:mb-6.5">
                  <h4 className="text-subtitle-2 uppercase text-description-color mb-[10px]">Published</h4>
                  <p className="text-subtitle-3">{data.date.split("-").reverse().join(" - ")}</p>
                </div>
                <div>
                  <h4 className="text-subtitle-2 uppercase text-description-color mb-[10px]">Topic</h4>
                  <p className="text-subtitle-3">{data.category}</p>
                </div>
              </div>
            </div>
            <div>
              <div>
                {data.content.map((item, index) => (
                  <div key={index}>
                    {item.type === "heading main" && <h2 className="text-subtitle mb-40">{item.text}</h2>}
                    {item.type === "heading" && <h2 className="text-subtitle mb-30">{item.text}</h2>}
                    {item.type === "first two paragraph" &&
                      item.introData.map((intro, introIndex) => (
                        <div key={introIndex}>
                          <p
                            className={`text-description-4 text-description-color ${
                              introIndex === item.introData.length - 1 ? "mb-60" : "mb-7.5"
                            }`}
                          >
                            {intro}
                          </p>
                        </div>
                      ))}
                    {item.type === "paragraph" && (
                      <p className="text-description-4 text-description-color mb-30">{item.text}</p>
                    )}
                    {item.type === "image" && item.src && (
                      <Image
                        src={item.src}
                        alt={item.alt || ""}
                        width={1200}
                        height={600}
                        className="rounded-[10px] w-full object-cover h-auto max-h-[600px] mb-60"
                      />
                    )}
                    {item.type === "list" && (
                      <ul className="list-disc ml-6 mb-30 marker:text-[24px]">
                        {item.items.map((listItem) => (
                          <li className="text-description-4 text-description-color" key={listItem}>
                            {listItem}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Main;
