"use client";
import { motion } from "framer-motion";

export default function MobileMenuIcon({ isOpen }: { isOpen: boolean }) {
  const ease = [0.65, 0, 0.35, 1] as [number, number, number, number];
  return (
<svg
  width="20"
  height="20"
  viewBox="0 0 20 20"
  fill="none"
  className="shrink-0"
>
  <motion.line
    x1="3"
    y1="5"
    x2="18"
    y2="5"
    stroke="#0A0A0A"
    strokeWidth="2"
    strokeLinecap="round"
    animate={{
      rotate: isOpen ? 45 : 0,
      y: isOpen ? 5.5 : 0,
    }}
    style={{ transformBox: "fill-box", transformOrigin: "center" }}
    transition={{ duration: 0.35, ease }}
  />
  <motion.line
    x1="3"
    y1="10.5"
    x2="18"
    y2="10.5"
    stroke="#0A0A0A"
    strokeWidth="2"
    strokeLinecap="round"
    animate={{ opacity: isOpen ? 0 : 1 }}
    transition={{ duration: 0.2, ease }}
  />
  <motion.line
    x1="3"
    y1="16"
    x2="18"
    y2="16"
    stroke="#0A0A0A"
    strokeWidth="2"
    strokeLinecap="round"
    animate={{
      rotate: isOpen ? -45 : 0,
      y: isOpen ? -5.5 : 0,
    }}
    style={{ transformBox: "fill-box", transformOrigin: "center" }}
    transition={{ duration: 0.35, ease }}
  />
</svg>
  );
}
