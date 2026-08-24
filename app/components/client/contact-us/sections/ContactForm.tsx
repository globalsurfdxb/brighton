"use client";

import { useForm } from "react-hook-form";
import FormInput from "@/app/components/client/forms/FormInput";
import CustomButton from "../../common/CustomButton";
import FormTextArea from "../../forms/FormTextArea";

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  company: string;
  role: string;
  message: string;
}

export default function ContactForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ContactFormData>();

  const onSubmit = (data: ContactFormData) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="grid grid-cols-1 gap-4 md:gap-50 mb-30 md:mb-40">
        <FormInput
          label="Name"
          required
          {...register("name", { required: "Name is required" })}
          error={errors.name?.message}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-30">
          <FormInput
            label="Email"
            type="email"
            required
            {...register("email", { required: "Email is required" })}
            error={errors.email?.message}
          />
          <FormInput
            label="Phone"
            {...register("phone")}
            error={errors.phone?.message}
          />
        </div>

        <FormInput
          label="Company"
          {...register("company")}
          error={errors.company?.message}
        />

        <FormInput
          label="Role"
          {...register("role")}
          error={errors.role?.message}
        />

        <FormTextArea
          label="Message"
          {...register("message")}
          error={errors.message?.message}
        />
      </div>

      <CustomButton
        text="Submit"
        variant="2"
        onClick={handleSubmit(onSubmit)}
      />
    </form>
  );
}
