"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import FormInput from "@/app/components/client/forms/FormInput";
import CustomButton from "../common/CustomButton";
import { motion } from "framer-motion";
import { moveUp } from "../animations/motionVariants";
import {
  catalogueFormSchema,
  CatalogueFormValues,
} from "@/lib/validations/catalogueFormSchema";

interface CatalogueRequestFormProps {
  onSuccess?: () => void;
}

export default function CatalogueRequestForm({
  onSuccess,
}: CatalogueRequestFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CatalogueFormValues>({
    resolver: zodResolver(catalogueFormSchema),
  });

  const onSubmit = async (data: CatalogueFormValues) => {
    try {
      const res = await fetch("/api/digital-catalogue/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const { message } = await res.json();

      if (!res.ok) {
        toast.error(message || "Something went wrong. Please try again.");
        return;
      }

      toast.success(
        "Thanks! Your catalogue will be emailed to you once our admin approves your request.",
      );
      reset();
      onSuccess?.();
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
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
          text={isSubmitting ? "Submitting..." : "Submit"}
          variant="2"
          disabled={isSubmitting}
          onClick={handleSubmit(onSubmit)}
        />
      </motion.div>
    </form>
  );
}
