"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import FormInput from "@/app/components/client/forms/FormInput";
import CustomButton from "../../common/CustomButton";
import FormTextArea from "../../forms/FormTextArea";
import { motion } from "framer-motion";
import { moveUp } from "../../animations/motionVariants";
import {
  contactFormSchema,
  ContactFormValues,
} from "@/lib/validations/contactFormSchema";

export default function ContactForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
  });

  const onSubmit = (data: ContactFormValues) => {
    console.log(data);
    window.location.replace("/thank-you");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="grid grid-cols-1 gap-4 md:gap-40 mb-30 md:mb-40">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={moveUp(0.02)}
        >
          <FormInput
            label="Name"
            required
            {...register("name")}
            error={errors.name?.message}
          />
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={moveUp(0.06)}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-30"
        >
          <FormInput
            label="Email"
            type="email"
            required
            {...register("email")}
            error={errors.email?.message}
          />
          <FormInput
            label="Phone"
            {...register("phone")}
            type="number"
            error={errors.phone?.message}
          />
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={moveUp(0.1)}
        >
          <FormInput
            label="Company"
            {...register("company")}
            error={errors.company?.message}
          />
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={moveUp(0.14)}
        >
          <FormInput
            label="Role"
            {...register("role")}
            error={errors.role?.message}
          />
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={moveUp(0.18)}
        >
          <FormTextArea
            label="Message"
            {...register("message")}
            error={errors.message?.message}
          />
        </motion.div>
      </div>

      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        variants={moveUp(0.22)}
      >
        <CustomButton
          text="Submit"
          variant="2"
          onClick={handleSubmit(onSubmit)}
        />
      </motion.div>
    </form>
  );
}
