"use client";

import { forwardRef, useRef } from "react";

interface FormTextAreaProps extends Omit<
  React.TextareaHTMLAttributes<HTMLTextAreaElement>,
  "name"
> {
  label: string;
  name: string;
  required?: boolean;
  rows?: number;
  error?: string;
}

const FormTextArea = forwardRef<HTMLTextAreaElement, FormTextAreaProps>(
  ({ label, name, required = false, error, placeholder, ...rest }, ref) => {
    const localRef = useRef<HTMLTextAreaElement>(null);

    const setRefs = (node: HTMLTextAreaElement | null) => {
      localRef.current = node;

      if (typeof ref === "function") {
        ref(node);
      } else if (ref) {
        ref.current = node;
      }
    };

    return (
      <div
        className="relative w-full pb-3 md:pb-[14px] 2xl:pb-5 cursor-text h-[80px] lg:h-[100px] xl:h-[140px] 3xl:h-[160px] flex items-end"
        onClick={() => localRef.current?.focus()}
      >
        <textarea
          id={name}
          name={name}
          ref={setRefs}
          required={required}
          placeholder={placeholder ?? " "}
          {...rest}
          className="peer w-full bg-transparent text-description-4 text-description-color outline-none resize-none placeholder:text-transparent block pt-3 leading-3 overflow-x-auto overflow-y-hidden whitespace-nowrap"
        />

        <label
          htmlFor={name}
          className="
            absolute left-0 top-0 origin-left
            transition-transform duration-500 ease-in-out
            pointer-events-none text-description-color select-none
            text-description-4
            scale-[0.79] -translate-y-[10px] md:-translate-y-[15px]
            peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0
            peer-focus:!scale-[0.79] peer-focus:!-translate-y-[10px] md:peer-focus:!-translate-y-[15px]
          "
        >
          {label}
          {required && (
            <span
              className="ml-[3px] text-description-color text-[16px] lg:text-[22px]"
            >
              *
            </span>
          )}
        </label>

        <span className="absolute left-0 bottom-5 w-full h-px bg-secondary" />

        <span
          className={`absolute left-0 bottom-5 h-px transition-all duration-500 ease-in-out ${
            error ? "w-full bg-red-500" : "w-0 bg-description-color peer-focus:w-full"
          }`}
        />

        <span className="absolute left-0 bottom-0 h-5 text-[14px] font-itc-book text-red-500 pt-[2px]">
          {error ?? ""}
        </span>
      </div>
    );
  },
);

FormTextArea.displayName = "FormTextArea";

export default FormTextArea;
