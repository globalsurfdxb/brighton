"use client";

import { forwardRef } from "react";

interface FormInputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "name"
> {
  label: string;
  name: string;
  required?: boolean;
  error?: string;
}

const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ label, name, type = "text", required = false, error, ...rest }, ref) => {
    return (
      <div className="relative w-full pb-[calc(25px+20px)] md:pb-[calc(40px+20px)]">
        <input
          id={name}
          type={type}
          name={name}
          required={required}
          placeholder=" "
          ref={ref}
          {...rest}
          className="peer absolute left-0 bottom-5 w-full bg-transparent text-description-4 text-description-color outline-none"
        />

        <label
          htmlFor={name}
          className={`
            absolute left-0 bottom-8 origin-left
            transition-transform duration-500 ease-in-out
            pointer-events-none text-description-color select-none
            text-description-4
            scale-[0.79] -translate-y-[10px] md:-translate-y-[15px]
            peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0
            peer-focus:!scale-[0.79] peer-focus:!-translate-y-[10px] md:peer-focus:!-translate-y-[15px]
          `}
        >
          {label}
          {required && (
            <span
              className="ml-[3px] text-description-color text-[16px] lg:text-[22px]">
              *
            </span>
          )}
        </label>

        {/* base line */}
        <span className="absolute left-0 bottom-5 w-full h-px bg-description-color/30" />
        {/* animated fill line */}
        <span
          className={`absolute left-0 bottom-5 h-px transition-all duration-500 ease-in-out
            ${error ? "w-full bg-red-500" : "w-0 bg-secondary peer-focus:w-full"}`}
        />
        <span className="absolute left-0 bottom-0 h-5 text-15 text-red-500">
          {error ?? ""}
        </span>
      </div>
    );
  },
);

FormInput.displayName = "FormInput";

export default FormInput;
