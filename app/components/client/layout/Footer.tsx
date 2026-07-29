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

export default function Footer() {
  return (
    <footer className="border-t border-black">
      <div className="container pt-100 pb-70">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-x-6 gap-y-10">
          {footerColumns.map((column) => (
            <div
              key={column.title}
              className="flex flex-col gap-6 min-[1850px]:gap-[26px]"
            >
              <h3 className="text-subtitle">{column.title}</h3>
              <ul className="flex flex-col">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-18 leading-[2.11111111] font-itc-medium tracking-[-0.01em] text-description-color hover:text-primary transition-colors duration-500"
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
          <div className="col-span-2 text-description text-description-color hover:text-primary transition-colors duration-500 w-fit">
            <p>{footerAddress.line1}</p>
            <p>{footerAddress.line2}</p>
          </div>

          <div className="col-span-2 lg:col-start-3 text-subtitle flex flex-col">
            <Link className="w-fit" href={`tel:${footerContact.phone}`}>{footerContact.phone}</Link>
            <Link className="w-fit" href={`mailto:${footerContact.email}`}>{footerContact.email}</Link>
          </div>

          <div className="col-span-2 lg:col-start-5 flex flex-wrap gap-x-30 gap-y-2 text-description text-description-color">
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
      </div>

      <div className="bg-[#F8F8F8]">
        <div className="container flex flex-col sm:flex-row items-center pt-[27px] pb-[23px] text-subtitle-2 text-description-color">
          <div className="flex gap-40 min-[1850px]:gap-[47px]">
            {footerLegal.links.map((link) => (
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
