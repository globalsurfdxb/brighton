"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import SectionDescription from "../animations/SectionDescription";
import CatalogueRequestForm from "./CatalogueRequestForm";

const ease = [0.65, 0, 0.35, 1] as [number, number, number, number];

interface CatalogueRequestDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CatalogueRequestDrawer({
  isOpen,
  onClose,
}: CatalogueRequestDrawerProps) {
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            key="catalogue-drawer-backdrop"
            className="fixed inset-0 z-[100] bg-black/60"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease }}
            onClick={onClose}
          />

          <motion.div
            key="catalogue-drawer-panel"
            role="dialog"
            aria-modal="true"
            aria-label="Download catalogue"
            className="fixed inset-x-0 bottom-0 z-[101] max-h-[90vh] overflow-y-auto rounded-t-[10px] bg-white"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.45, ease }}
          >
            <div className="px-50 pt-8 pb-10 md:py-100">
              <div className="flex items-start justify-between gap-6 mb-30 md:mb-50">
                <div>
                  <h3 className="text-subtitle text-28 md:text-32">
                    Download Catalogue
                  </h3>
                  <SectionDescription
                    text="Please fill out the form below to access our latest product catalogue."
                    className="text-subtitle text-description-color max-w-[37ch] mt-2"
                    direction="y"
                  />
                </div>

                <button
                                style={
                  {
                    "--fill-color": "var(--color-primary, #0A0A0A)",
                  } as React.CSSProperties
                }
                  type="button"
                  onClick={onClose}
                  aria-label="Close"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-secondary transition-colors duration-500 hover:text-white cursor-pointer btn-fill-center"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <CatalogueRequestForm onSuccess={onClose} />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
