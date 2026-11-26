"use client";

import AnimatedTitle from "../../animations/AnimatedTitle";
import ContactForm from "./ContactForm";
import SectionDescription from "../../animations/SectionDescription";
import { motion } from "framer-motion";
import { moveRight, moveUp } from "../../animations/motionVariants";
import Link from "next/link";
import type { ContactSectionData } from "../types";

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

export default function ContactSection({
  data,
}: {
  data: ContactSectionData;
}) {
  const addressHtml = escapeHtml(data.address.trim()).replace(/\r?\n/g, "<br>");

  return (
    <section className="w-full top-spacing pb-100">
      <div className="container">
        <AnimatedTitle
          text={data.title}
          className="hero-title mb-5 md:mb-100"
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 3xl:grid-cols-[1fr_895px] gap-30 lg:gap-0 mb-50">
          <div className="flex flex-col gap-3 md:gap-7.5">
            <SectionDescription
              link={data.addressLink || undefined}
              as="div"
              direction="y"
              html={addressHtml}
              className="text-description-4 text-description-color hover:text-primary transition-colors duration-500"
            />
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              variants={moveUp(0.1)}
              className="text-description-4 text-primary flex flex-col"
            >
              {data.phone && (
                <Link
                  className="hover:text-description-color transition-colors duration-500"
                  href={`tel:${data.phone.replace(/\s+/g, "")}`}
                >
                  Phone: {data.phone}
                </Link>
              )}
              {data.email && (
                <Link
                  className="hover:text-description-color transition-colors duration-500"
                  href={`mailto:${data.email}`}
                >
                  Email: {data.email}
                </Link>
              )}
            </motion.div>
          </div>

          <SectionDescription
            direction="y"
            text={data.description}
            className="text-subtitle text-description-color max-w-[47ch] xl:mr-60 min-[1900px]:mr-[154px]"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 3xl:grid-cols-[1fr_895px] items-end gap-100">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={moveRight(0.15)}
            className="w-full min-h-[280px] lg:w-[80%] aspect-[741/466] 3xl:w-[741px] rounded-[10px] overflow-hidden"
          >
            {data.mapLink && (
              <iframe
                title="Office location map"
                src={data.mapLink}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            )}
          </motion.div>

          <ContactForm />
        </div>
      </div>
    </section>
  );
}
