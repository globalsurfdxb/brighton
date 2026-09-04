"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import Link from "next/link";
import CustomButton from "./components/client/common/CustomButton";

export default function NotFound() {
    const circleRef = useRef<SVGGElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const textRef = useRef<HTMLParagraphElement>(null);
    const btnRef = useRef<HTMLDivElement>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const prefersReducedMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

        const ctx = gsap.context(() => {
            if (prefersReducedMotion) {
                gsap.set(
                    [circleRef.current, titleRef.current, textRef.current, btnRef.current],
                    { opacity: 1, scale: 1, rotate: 0, y: 0 }
                );
                return;
            }

            gsap.set(circleRef.current, {
                transformOrigin: "50% 50%",
                rotate: 0,
                opacity: 0,
                scale: 0.6,
            });
            gsap.set(titleRef.current, { opacity: 0, y: 16 });
            gsap.set(textRef.current, { opacity: 0, y: 16 });
            gsap.set(btnRef.current, { opacity: 0, y: 16 });

            const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

            tl.to(circleRef.current, {
                opacity: 1,
                scale: 1,
                rotate: 720,
                duration: 1.05,
                ease: "power2.inOut",
            })
                .to(titleRef.current, { opacity: 1, y: 0, duration: 0.6 }, "-=0.35")
                .to(textRef.current, { opacity: 1, y: 0, duration: 0.6 }, "-=0.3")
                .to(btnRef.current, { opacity: 1, y: 0, duration: 0.6 }, "-=0.3");

            gsap.to(circleRef.current, {
                rotate: "+=360",
                duration: 6,
                ease: "none",
                repeat: -1,
                delay: 1.05,
            });
        }, wrapperRef);

        return () => ctx.revert();
    }, []);

    return (
        <div
            ref={wrapperRef}
            className="relative flex h-svh w-full flex-col items-center justify-center gap-8 overflow-hidden bg-black px-6 text-center"
        >
            {/* Ambient side lighting */}
            <div className="light-glow glow-left-1 pointer-events-none absolute" />
            <div className="light-glow glow-left-2 pointer-events-none absolute" />
            <div className="light-glow glow-left-3 pointer-events-none absolute" />
            <div className="light-glow glow-right-1 pointer-events-none absolute" />
            <div className="light-glow glow-right-2 pointer-events-none absolute" />
            <div className="light-glow glow-right-3 pointer-events-none absolute" />

            <h1
                ref={titleRef}
                className="relative z-10 flex items-center justify-center text-[100px] sm:text-[180px] font-semibold uppercase leading-[1] text-white"
            >
                <span>4</span>
                <span className="relative inline-flex items-center justify-center">
                    0
                    <svg
                        viewBox="0 0 24 24"
                        className="absolute left-1/2 top-1/2 h-[0.52em] w-[0.52em] -translate-x-1/2 -translate-y-1/2"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <g ref={circleRef}>
                            <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                fill="white"
                                d="M13.5 2.6C13.6 3 13.75 3.15 13.9 3.28C14.68 3.87 15.24 4.5 15.6 5.4C16.55 7.75 15.05 10.55 12.2 10.98C10.55 11.22 8.85 10.55 7.9 9.25C6.45 7.25 7.0 4.6 8.85 3.3C9.12 3.1 9.3 2.98 9.42 2.66C9.63 2.03 9.12 1.35 8.4 1.42C8.06 1.45 7.85 1.64 7.6 1.83C5.5 3.4 4.4 6.1 5.3 8.65C5.75 9.95 6.5 10.85 7.32 11.5C9.3 13.1 12.2 13.5 14.7 12C16.9 10.7 18.2 8.1 17.7 5.5C17.55 4.85 17.35 4.2 17.05 3.7C16.9 3.43 16.75 3.2 16.6 2.98C16.2 2.45 15.2 1.45 14.6 1.3C13.9 1.13 13.3 1.73 13.42 2.44"
                            />
                            <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                fill="white"
                                d="M12.4 6.7C12.43 6.15 12.4 3.3 12.4 2.5C12.4 1.78 12.52 1.06 12.05 0.72C11.47 0.33 10.8 0.77 10.75 1.33C10.68 1.98 10.75 2.85 10.75 3.5V6.65C10.75 7.75 12.3 7.82 12.4 6.75"
                            />
                        </g>
                    </svg>
                </span>
                <span>4</span>
            </h1>

            <p ref={textRef} className="relative z-10 max-w-[480px] text-lg text-white/60">
                This page has been switched off. It may have moved, been renamed,
                or never existed.
            </p>

            <div ref={btnRef} className="relative z-10">
                <CustomButton
                    text="Back To Home"
                    link="/"
                    btnClass="w-fit"
                />
            </div>

            <style jsx>{`
                .light-glow {
                    border-radius: 50%;
                    filter: blur(90px);
                    animation-timing-function: ease-in-out;
                    animation-iteration-count: infinite;
                    mix-blend-mode: screen;
                }

                .glow-left-1 {
                    left: -15%;
                    top: 10%;
                    width: 620px;
                    height: 620px;
                    background: radial-gradient(
                        circle,
                        rgba(255, 180, 80, 0.75) 0%,
                        rgba(255, 180, 80, 0.3) 40%,
                        transparent 72%
                    );
                    animation: drift-a 9s infinite, pulse-a 5s infinite;
                }
                .glow-left-2 {
                    left: -5%;
                    bottom: -5%;
                    width: 480px;
                    height: 480px;
                    background: radial-gradient(
                        circle,
                        rgba(120, 170, 255, 0.7) 0%,
                        rgba(120, 170, 255, 0.28) 40%,
                        transparent 72%
                    );
                    animation: drift-b 11s infinite, pulse-b 6.5s infinite;
                    animation-delay: -3s, -1.5s;
                }
                .glow-left-3 {
                    left: 8%;
                    top: 45%;
                    width: 320px;
                    height: 320px;
                    background: radial-gradient(
                        circle,
                        rgba(255, 120, 180, 0.55) 0%,
                        rgba(255, 120, 180, 0.2) 40%,
                        transparent 72%
                    );
                    animation: drift-a 8s infinite, pulse-b 5.5s infinite;
                    animation-delay: -2s, -4s;
                }

                .glow-right-1 {
                    right: -15%;
                    bottom: 8%;
                    width: 620px;
                    height: 620px;
                    background: radial-gradient(
                        circle,
                        rgba(120, 170, 255, 0.75) 0%,
                        rgba(120, 170, 255, 0.3) 40%,
                        transparent 72%
                    );
                    animation: drift-b 10s infinite, pulse-a 5.5s infinite;
                    animation-delay: -5s, -2s;
                }
                .glow-right-2 {
                    right: -4%;
                    top: -5%;
                    width: 480px;
                    height: 480px;
                    background: radial-gradient(
                        circle,
                        rgba(255, 180, 80, 0.7) 0%,
                        rgba(255, 180, 80, 0.28) 40%,
                        transparent 72%
                    );
                    animation: drift-a 12s infinite, pulse-b 6s infinite;
                    animation-delay: -6s, -3s;
                }
                .glow-right-3 {
                    right: 10%;
                    bottom: 42%;
                    width: 320px;
                    height: 320px;
                    background: radial-gradient(
                        circle,
                        rgba(180, 120, 255, 0.55) 0%,
                        rgba(180, 120, 255, 0.2) 40%,
                        transparent 72%
                    );
                    animation: drift-b 9.5s infinite, pulse-a 6.5s infinite;
                    animation-delay: -4s, -1s;
                }

                @keyframes drift-a {
                    0%, 100% { transform: translate(0, 0) scale(1); }
                    50% { transform: translate(45px, -35px) scale(1.15); }
                }
                @keyframes drift-b {
                    0%, 100% { transform: translate(0, 0) scale(1); }
                    50% { transform: translate(-40px, 30px) scale(1.12); }
                }
                @keyframes pulse-a {
                    0%, 100% { opacity: 0.65; }
                    50% { opacity: 1; }
                }
                @keyframes pulse-b {
                    0%, 100% { opacity: 0.5; }
                    50% { opacity: 0.95; }
                }
            `}</style>
        </div>
    );
}