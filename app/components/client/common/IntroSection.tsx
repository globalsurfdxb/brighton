import AnimatedDivider from "../animations/AnimatedDivider";
import CustomButton from "@/app/components/client/common/CustomButton";

interface IntroSectionProps {
  data: {
    description: string;
    linkText?: string;
    link?: string;
  };
  className?: string;
}

const IntroSection = ({ data, className }: IntroSectionProps) => {
  return (
    <section>
      <div className="container">
        <div className={`xl:ml-[30%] 3xl:ml-115.75 py-100 ${className}`}>
          <p className="text-subtitle text-description-color">
            {data.description}
          </p>
          {data.linkText && data.link && (
            <CustomButton
              text={data.linkText}
              link={data.link}
              variant="2"
              btnClass="w-fit mt-40"
            />
          )}
        </div>
        <AnimatedDivider className="border-secondary" />
      </div>
    </section>
  );
};

export default IntroSection;
