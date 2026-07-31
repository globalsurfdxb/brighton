"use client";

import Link from "next/link";
import {
  footerColumns,
  footerAddress,
  footerContact,
  footerSocials,
  footerLegal,
} from "./data";
import { motion } from "framer-motion";
import Image from "next/image";
import AnimatedTitle from "../animations/AnimatedTitle";

export default function Footer() {
  return (
    <footer className="border-t border-black z-10 bg-white">
      <div className="container pt-100 pb-70">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-x-6 gap-y-5 lg:gap-y-10">
          {footerColumns.map((column) => (
            <div
              key={column.title}
              className="flex flex-col gap-6 min-[1850px]:gap-[26px]"
            >
              <AnimatedTitle
                className="text-subtitle"
                text={column.title}
                tag="h3"
              />
              <ul className="flex flex-col">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-18 leading-[1.8888888889] font-itc-medium tracking-[-0.01em] text-description-color hover:text-primary transition-colors duration-500"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <motion.div
          className="mt-100 mb-70 h-px w-full origin-left"
          style={{
            background:
              "linear-gradient(90deg, rgba(191, 191, 191, 0.1) 0%, rgba(191, 191, 191, 0.5) 50%, rgba(191, 191, 191, 0.1) 100%)",
          }}
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 1, ease: [0.65, 0, 0.35, 1] }}
        />

        <div className="grid grid-cols-2 lg:grid-cols-6 gap-x-6 gap-y-8">
          <div className="col-span-2 text-description text-description-color hover:text-primary transition-colors duration-500 w-fit max-w-[35ch]">
            <p>{footerAddress.line}</p>
          </div>

          <div className="col-span-2 lg:col-start-3 text-subtitle flex flex-col">
            <Link
              className="w-fit hover:text-description-color transition-colors duration-500"
              href={`tel:${footerContact.phone}`}
            >
              {footerContact.phone}
            </Link>
            <Link
              className="w-fit hover:text-description-color transition-colors duration-500"
              href={`mailto:${footerContact.email}`}
            >
              {footerContact.email}
            </Link>

            <div className="flex flex-wrap gap-x-30 gap-y-2 text-description text-description-color mt-30">
              {footerSocials.map((social) => (
                <Link
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-black transition-colors duration-500 w-fit"
                >
                  {social.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="col-span-2 lg:col-start-5 flex flex-wrap gap-x-30 gap-y-2 text-description text-description-color">
            <Link href={"#"}>
              <button className="btn-fill-center cursor-pointer max-h-[80px] rounded-[50px] border border-secondary px-6 lg:px-8 3xl:px-[39.5px] py-3 lg:py-6 3xl:py-[27px] transition-colors duration-500 group w-full flex items-center justify-center gap-4 bg-primary">
                <span className="text-subtitle text-24 3xl:text-28  !leading-none text-white max-h-[21px] group-hover:text-primary">
                  Download Catalogue
                </span>
                <Image
                  src="/assets/icons/download-primary.svg"
                  alt="Download Catalogue"
                  width={26}
                  height={26}
                  className="invert brightness-0 transition-all duration-500 group-hover:invert-0 group-hover:brightness-100 w-auto h-5 3xl:h-[26px]"
                />
              </button>
            </Link>
          </div>
        </div>
      </div>

      <div className="bg-[#F8F8F8]">
        <div className="container flex flex-col sm:flex-row items-center pt-[27px] pb-[23px] text-subtitle-2 text-description-color">
          <div className="flex flex-wrap gap-5 lg:gap-40 min-[1850px]:gap-[47px]">
            <span className="w-fit">{footerLegal.links[0].label}</span>
            {footerLegal.links.slice(1).map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="hover:text-black transition-colors w-fit"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
