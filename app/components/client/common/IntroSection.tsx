"use client";

import AnimatedDivider from "../animations/AnimatedDivider";
import CustomButton from "@/app/components/client/common/CustomButton";
import SectionDescription from "../animations/SectionDescription";
import { moveUp } from "../animations/motionVariants";
import { motion } from "framer-motion";

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
          <SectionDescription
            direction="y"
            className="text-subtitle text-description-color"
            text={data.description}
          />
          {data.linkText && data.link && (
            <motion.div
              variants={moveUp(0)}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
            >
              <CustomButton
                text={data.linkText}
                link={data.link}
                variant="2"
                btnClass="w-fit mt-40"
              />
            </motion.div>
          )}
        </div>
        <AnimatedDivider className="border-secondary" />
      </div>
    </section>
  );
};

export default IntroSection;
