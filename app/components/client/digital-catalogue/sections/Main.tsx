"use client";

import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import FormInput from "@/app/components/client/forms/FormInput";
import AnimatedTitle from "../../animations/AnimatedTitle";
import CustomButton from "../../common/CustomButton";
import { motion } from "framer-motion";
import { moveRight, moveUp } from "../../animations/motionVariants";
import SectionDescription from "../../animations/SectionDescription";
import {
  catalogueFormSchema,
  CatalogueFormValues,
} from "@/lib/validations/catalogueFormSchema";

export default function Main() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CatalogueFormValues>({
    resolver: zodResolver(catalogueFormSchema),
  });

  const onSubmit = (data: CatalogueFormValues) => {
    console.log(data);
  };

  return (
    <section className="w-full pb-100 top-spacing">
      <div className="container">
        <AnimatedTitle
          text="Digital Catalogue"
          className="hero-title mb-30 md:mb-80 min-[1900px]:mb-[83px]"
        />

        <div className="flex flex-col md:flex-row gap-40 lg:gap-60 xl:gap-130 min-[1900px]:gap-[184px]">
          {/* Left - catalogue cover */}
          <motion.div
            variants={moveRight(0.1)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="relative w-full md:w-[38%] lg:w-[35%] max-[639px]:max-h-[400px] max-[767px]:max-h-[450px] aspect-[587/747] 3xl:w-[587px] 3xl:h-[747px] shrink-0 rounded-[10px] overflow-hidden select-none"
          >
            <Image
              src="/assets/images/resources/catalogue.png"
              alt="Brighton Catalogue 2026"
              fill
              className="object-cover object-center pointer-events-none"
            />

            {/* <div className="absolute inset-0 bg-black/20" /> */}

            <div className="absolute z-10 left-5 lg:left-40 3xl:left-[48px] top-60 lg:top-100 3xl:top-[117px]">
              <Image
                src="/assets/logos/header-logo.svg"
                alt="Brighton"
                width={372}
                height={50}
                className="invert brightness-0 h-6 xl:h-10 3xl:h-12.5 w-auto max-w-[372px] pointer-events-none"
              />
              <p
                className="text-[26px] font-itc-medium tracking-[-0.01em] leading-[2.5] bg-clip-text text-transparent mt-2 xl:mt-4.5"
                style={{
                  backgroundImage:
                    "linear-gradient(180deg, #FFFFFF 25.38%, #999999 60%)",
                }}
              >
                CATALOGUE 2026
              </p>
            </div>
          </motion.div>

          {/* Right - form */}
          <div className="w-full flex-1 lg:mt-80">
            <SectionDescription
              text="Please fill out the form below to access our latest product
              catalogue."
              className="text-subtitle text-description-color max-w-[37ch] mb-80"
              direction="y"
            />

            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-40 mb-30 md:mb-60">
                <motion.div
                  variants={moveUp(0)}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true }}
                >
                  <FormInput
                    label="Name"
                    required
                    {...register("name")}
                    error={errors.name?.message}
                  />
                </motion.div>

                <motion.div
                  variants={moveUp(0.05)}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true }}
                >
                  <FormInput
                    label="Company"
                    {...register("company")}
                    error={errors.company?.message}
                  />
                </motion.div>

                <motion.div
                  variants={moveUp(0.1)}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true }}
                >
                  <FormInput
                    label="Email"
                    type="email"
                    required
                    {...register("email")}
                    error={errors.email?.message}
                  />
                </motion.div>

                <motion.div
                  variants={moveUp(0.15)}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true }}
                >
                  <FormInput
                    label="Role"
                    {...register("role")}
                    error={errors.role?.message}
                  />
                </motion.div>
              </div>

              <motion.div
                variants={moveUp(0.2)}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
              >
                <CustomButton
                  text={"Download Catalogue"}
                  variant="2"
                  onClick={handleSubmit(onSubmit)}
                />
              </motion.div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
