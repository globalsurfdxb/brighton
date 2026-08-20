"use client"
import AnimatedTitle from "../../animations/AnimatedTitle";
import CustomButton from "../../common/CustomButton";
import Image, { StaticImageData } from "next/image";

export interface NewsDetails {
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

const Main = ({ data }: { data: NewsDetails }) => {
  return (
    <section className="mt-100 py-100">
      <div className="container">
        <div>
          <AnimatedTitle text={data.title} className="section-title mb-40 max-w-[60ch]" />
          <div className="mb-80">
            <div className="flex md:justify-between mb-4 xl:mb-7.5 3xl:max-w-[1566px]">
              <div><p>Published on: {data.date}</p></div>
              <div><CustomButton text={data.category} variant="2" showIcon={false} /></div>
            </div>
            <div>
              <Image src={data.heroImage} alt={data.title} width={1820} height={700}
                className="rounded-[10px] w-full object-cover h-auto max-h-[700px]" />
            </div>
          </div>
          <div className="grid grid-cols-1 xl:grid-cols-[309px_auto] gap-x-40 3xl:gap-x-[155px]">
            <div>
              <div>
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
                    {item.type === "first two paragraph" && item.introData.map((intro, index) => (
                      <div key={index}>
                        <p className={`text-description-4 text-description-color ${index === item.introData.length - 1 ? "mb-60" : "mb-7.5"}`}>{intro}</p>
                      </div>
                    ))}
                    {item.type === "paragraph" && <p className="text-description-4 text-description-color mb-30">{item.text}</p>}
                    {item.type === "image" && item.src && <Image src={item.src} alt={item.alt || ""} width={1200} height={600} className="rounded-[10px] w-full object-cover h-auto max-h-[600px] mb-60" />}
                    {item.type === "list" && (
                      <ul className="list-disc ml-6 mb-30 marker:text-[24px]">
                        {item.items.map((listItem) => (
                          <li className="text-description-4 text-description-color" key={listItem}>{listItem}</li>
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
}

export default Main;
