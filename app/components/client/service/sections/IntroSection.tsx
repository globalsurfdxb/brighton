import AnimatedDivider from "../../animations/AnimatedDivider";
import { introData } from "../data";
import CustomButton from "@/app/components/client/common/CustomButton";

const IntroSection = () => {
  return (
    <section className="">
      <div className="container  ">
        <div className="max-w-244.25 2xl:ml-[30%] 3xl:ml-115.75 py-100">
          <p className="text-subtitle text-description-color mb-40">{introData.description}</p>
          <CustomButton text={introData.linkText} link={introData.link} variant="2" btnClass="w-fit" />
        </div>
        <AnimatedDivider className="border-secondary" />
      </div>
    </section>
  );
};

export default IntroSection;