"use client";

import { contactData } from "../data";
import AnimatedTitle from "../../animations/AnimatedTitle";
import ContactForm from "./ContactForm";
import SectionDescription from "../../animations/SectionDescription";
import { motion } from "framer-motion";
import { moveRight, moveUp } from "../../animations/motionVariants";
import Link from "next/link";

export default function ContactSection() {
  return (
    <section className="w-full top-spacing pb-100">
      <div className="container">
        <AnimatedTitle
          text={contactData.title}
          className="hero-title mb-5 md:mb-100"
        />

        {/* Row 2 - address/phone/email + description */}
        <div className="grid grid-cols-1 lg:grid-cols-2 3xl:grid-cols-[1fr_895px] gap-30 lg:gap-0 mb-50">
          <div className="flex flex-col gap-3 md:gap-7.5">
            <SectionDescription
              link="https://maps.app.goo.gl/1Ze6x9FHGQF4eCPF8"
              as="div"
              direction="y"
              html={contactData.address}
              className="text-description-4 text-description-color hover:text-primary transition-colors duration-500"
            />
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              variants={moveUp(0.1)}
              className="text-description-4 text-primary flex flex-col"
            >
              <Link
                className="hover:text-description-color transition-colors duration-500"
                href={`tel:${contactData.phone}`}
              >
                Phone: {contactData.phone}
              </Link>
              <Link
                className="hover:text-description-color transition-colors duration-500"
                href={`mailto:${contactData.email}`}
              >
                Email: {contactData.email}
              </Link>
            </motion.div>
          </div>

          <SectionDescription
            direction="y"
            text={contactData.description}
            className="text-subtitle text-description-color max-w-[47ch] xl:mr-60 min-[1900px]:mr-[154px]"
          />
        </div>

        {/* Row 3 - map + form */}
        <div className="grid grid-cols-1 lg:grid-cols-2 3xl:grid-cols-[1fr_895px] items-end gap-100 lg:gap-0">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={moveRight(0.15)}
            className="w-full min-h-[280px] lg:w-[80%] aspect-[741/466] 3xl:w-[741px] rounded-[10px] overflow-hidden"
          >
            <iframe
              src={contactData.mapLink}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </motion.div>

          <ContactForm />
        </div>
      </div>
    </section>
  );
}
