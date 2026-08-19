"use client";

import Image from "next/image";
import { useForm } from "react-hook-form";
import FormInput from "@/app/components/client/forms/FormInput";
import AnimatedTitle from "../../animations/AnimatedTitle";
import CustomButton from "../../common/CustomButton";

interface CatalogueFormData {
  name: string;
  company: string;
  email: string;
  role: string;
}

export default function Main() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CatalogueFormData>();

  const onSubmit = (data: CatalogueFormData) => {
    console.log(data);
  };

  return (
    <section className="w-full pb-100 pt-200 3xl:pt-[206px]">
      <div className="container">
        <AnimatedTitle
          text="Digital Catalogue"
          className="hero-title mb-80 min-[1900px]:mb-[83px]"
        />

        <div className="flex flex-col lg:flex-row gap-40 lg:gap-130 min-[1900px]:gap-[184px]">
          {/* Left - catalogue cover */}
          <div className="relative w-full lg:w-[35%] aspect-[587/747] 3xl:w-[587px] 3xl:h-[747px] shrink-0 rounded-[10px] overflow-hidden">
            <Image
              src="/assets/images/resources/catalogue.jpg"
              alt="Brighton Catalogue 2026"
              fill
              className="object-cover object-center"
            />

            <div className="absolute inset-0 bg-black/20" />

            <div className="absolute z-10 left-40 3xl:left-[48px] top-100 3xl:top-[117px]">
              <Image
                src="/assets/logos/header-logo.svg"
                alt="Brighton"
                width={372}
                height={50}
                className="invert brightness-0 h-10 3xl:h-12.5 w-auto max-w-[372px]"
              />
              <p
                className="text-[26px] font-itc-medium tracking-[-0.01em] leading-[2.5] bg-clip-text text-transparent mt-4.5"
                style={{
                  backgroundImage:
                    "linear-gradient(180deg, #FFFFFF 25.38%, #999999 60%)",
                }}
              >
                CATALOGUE 2026
              </p>
            </div>
          </div>

          {/* Right - form */}
          <div className="w-full flex-1 lg:mt-80">
            <p className="text-subtitle text-description-color max-w-[37ch] mb-80">
              Please fill out the form below to access our latest product
              catalogue.
            </p>

            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-50 mb-60">
                <FormInput
                  label="Name"
                  required
                  {...register("name", { required: "Name is required" })}
                  error={errors.name?.message}
                />

                <FormInput
                  label="Company"
                  {...register("company")}
                  error={errors.company?.message}
                />

                <FormInput
                  label="Email"
                  type="email"
                  required
                  {...register("email", { required: "Email is required" })}
                  error={errors.email?.message}
                />

                <FormInput
                  label="Role"
                  {...register("role")}
                  error={errors.role?.message}
                />
              </div>

              <CustomButton
                text={"Download Catalogue"}
                variant="2"
                onClick={handleSubmit(onSubmit)}
              />
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
