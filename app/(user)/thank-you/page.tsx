"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import AnimatedTitle from "@/app/components/client/animations/AnimatedTitle";
import SectionDescription from "@/app/components/client/animations/SectionDescription";
import CustomButton from "@/app/components/client/common/CustomButton";

interface ThankYouProps {
    data?: {
        title: string;
        description: string;
        button: {
            text: string;
            href: string;
        };
    };
}

const defaultData = {
    title: "Thank You",
    description:
        "Your submission has been received. Our team will review it and get back to you shortly.",
    button: {
        text: "Back To Home",
        href: "/",
    },
};

export default function ThankYou({ data = defaultData }: ThankYouProps) {
    return (
        <section className="relative bg-black py-100 3xl:min-h-[330px] h-screen overflow-hidden flex justify-center items-center">
            {/* Ambient glow blooms */}
            <div className="glow-blob blob-1 pointer-events-none absolute" />
            <div className="glow-blob blob-2 pointer-events-none absolute" />
            <div className="glow-blob blob-3 pointer-events-none absolute" />
            <div className="glow-blob blob-4 pointer-events-none absolute" />

            {/* Glossy overlay sweep */}
            <motion.div
                initial={{ clipPath: "inset(0 0 0 0)" }}
                whileInView={{ clipPath: "inset(0 0 0 100%)" }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{
                    duration: 1.5,
                    ease: [0.22, 1, 0.36, 1],
                }}
                className="absolute inset-0 z-20 pointer-events-none"
                style={{
                    background:
                        "linear-gradient(90deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.03) 35%, rgba(255,255,255,0.03) 65%, rgba(255,255,255,0.1) 100%)",
                }}
            />

            <div className="container relative z-10">
                <div className="flex flex-col items-center text-center gap-30 max-w-[92%] mx-auto 3xl:max-w-[900px]">
                    <AnimatedTitle
                        tag="h2"
                        text={data.title}
                        className="section-title text-white"
                    />
                    <motion.div
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, amount: 0.4 }}
                        transition={{
                            duration: 1,
                            ease: [0.22, 1, 0.36, 1],
                        }}
                    >
                        <SectionDescription
                            text={data.description}
                            className="text-description text-white/60"
                        />
                    </motion.div>

                    <div className="w-fit">
                        <CustomButton
                            text="Back To Home"
                            link="/"
                            btnClass="w-fit"
                            variant="1"
                        />
                    </div>
                </div>
            </div>

            <style jsx>{`
        .glow-blob {
          border-radius: 50%;
          filter: blur(80px);
          animation-timing-function: ease-in-out;
          animation-iteration-count: infinite;
          mix-blend-mode: screen;
        }

        .blob-1 {
          left: -12%;
          top: 5%;
          width: 560px;
          height: 560px;
          background: radial-gradient(
            circle,
            rgba(80, 210, 200, 0.5) 0%,
            rgba(80, 210, 200, 0.18) 45%,
            transparent 75%
          );
          animation: drift-a 10s infinite, pulse-a 5.5s infinite;
        }
        .blob-2 {
          right: -12%;
          bottom: 0%;
          width: 560px;
          height: 560px;
          background: radial-gradient(
            circle,
            rgba(150, 110, 240, 0.5) 0%,
            rgba(150, 110, 240, 0.18) 45%,
            transparent 75%
          );
          animation: drift-b 11s infinite, pulse-b 6s infinite;
          animation-delay: -3s, -1.5s;
        }
        .blob-3 {
          left: 6%;
          bottom: -10%;
          width: 340px;
          height: 340px;
          background: radial-gradient(
            circle,
            rgba(255, 140, 100, 0.42) 0%,
            rgba(255, 140, 100, 0.14) 45%,
            transparent 75%
          );
          animation: drift-a 8.5s infinite, pulse-b 5s infinite;
          animation-delay: -2s, -4s;
        }
        .blob-4 {
          right: 8%;
          top: -8%;
          width: 340px;
          height: 340px;
          background: radial-gradient(
            circle,
            rgba(90, 160, 250, 0.42) 0%,
            rgba(90, 160, 250, 0.14) 45%,
            transparent 75%
          );
          animation: drift-b 9.5s infinite, pulse-a 6.5s infinite;
          animation-delay: -5s, -2.5s;
        }

        @keyframes drift-a {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(35px, -30px) scale(1.1); }
        }
        @keyframes drift-b {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-30px, 25px) scale(1.08); }
        }
        @keyframes pulse-a {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
        @keyframes pulse-b {
          0%, 100% { opacity: 0.45; }
          50% { opacity: 0.9; }
        }
      `}</style>
        </section>
    );
}