"use client";

import { heroData } from "../data";
import CustomButton from "../../common/CustomButton";
import AnimatedTitle from "../../animations/AnimatedTitle";
import { motion } from "framer-motion";
import { useIntroComplete } from "@/app/hooks/useIntroComplete";

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.65, 0, 0.35, 1] as [number, number, number, number],
    },
  },
};

export default function Hero() {
  const introComplete = useIntroComplete();
  return (
    <section className="fixed inset-0 h-svh w-full overflow-hidden z-0">
      <video
        className="absolute inset-0 h-full w-full object-cover"
        src={heroData.video}
        poster={heroData.poster}
        autoPlay
        muted
        loop
        playsInline
      />

      <div
        style={{
          background:
            "linear-gradient(180deg, rgba(0, 0, 0, 0.1) 21.13%, rgba(0, 0, 0, 0.7) 83.59%)",
        }}
        className="absolute inset-0"
      />

      <div className="relative z-10 flex h-full flex-col justify-end container pb-130">
        <motion.div
          variants={itemVariants}
          initial="hidden"
          animate={introComplete ? "visible" : "hidden"}
          transition={{ delay: 0.7 }}
        >
          <AnimatedTitle
            tag="h1"
            text={heroData.title}
            className="hero-title text-cream-background mb-5 max-w-[20ch]"
          />
        </motion.div>
        <div className="w-full flex flex-col lg:flex-row justify-between lg:items-end gap-5">
          <motion.p
            variants={itemVariants}
            initial="hidden"
            animate={introComplete ? "visible" : "hidden"}
            transition={{ delay: 0.9 }}
            className="text-description text-secondary max-w-[77ch]"
          >
            {heroData.description}
          </motion.p>
          <motion.div
            variants={itemVariants}
            initial="hidden"
            animate={introComplete ? "visible" : "hidden"}
            transition={{ delay: 1.3 }}
            className="flex flex-col lg:flex-row lg:items-center gap-4"
          >
            {heroData.buttons.map((button, index) => (
              <CustomButton
                key={index}
                text={button.text}
                link={button.link}
                btnClass="w-fit"
              />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
