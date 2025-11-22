"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";
import BloomingBackground from "./BloomingBackground";

export default function Hero() {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start start", "end start"],
    });

    const yText = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
    const opacityText = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
    const scaleImg = useTransform(scrollYProgress, [0, 1], [1, 1.2]);

    return (
        <section ref={ref} className="relative h-screen overflow-hidden flex items-center justify-center">
            <BloomingBackground />

            {/* Floating Images / Parallax Elements */}
            <motion.div
                style={{ y: useTransform(scrollYProgress, [0, 1], ["0%", "-20%"]) }}
                className="absolute top-10 right-10 w-32 md:w-48 aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl rotate-6 z-10 hidden md:block"
            >
                <Image src="/images/gallery-1.jpg" alt="Ingrid" fill className="object-cover" />
            </motion.div>

            <motion.div
                style={{ y: useTransform(scrollYProgress, [0, 1], ["0%", "-30%"]) }}
                className="absolute bottom-20 left-10 w-40 md:w-56 aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl -rotate-6 z-10 hidden md:block"
            >
                <Image src="/images/gallery-2.jpg" alt="Ingrid" fill className="object-cover" />
            </motion.div>

            {/* Main Content */}
            <motion.div
                style={{ y: yText, opacity: opacityText }}
                className="relative z-20 text-center p-4"
            >
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                    className="relative w-64 h-64 md:w-80 md:h-80 mx-auto mb-8 rounded-full overflow-hidden border-4 border-white shadow-2xl"
                >
                    <motion.div style={{ scale: scaleImg }} className="w-full h-full relative">
                        <Image
                            src="/images/hero.jpg"
                            alt="Ingrid 20 Anos"
                            fill
                            className="object-cover"
                            priority
                        />
                    </motion.div>
                </motion.div>

                <motion.h1
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5, duration: 1 }}
                    className="text-8xl md:text-[10rem] font-script mb-2 drop-shadow-sm text-fuchsia-600"
                >
                    Ingrid
                </motion.h1>
                <motion.p
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.8, duration: 1 }}
                    className="text-3xl md:text-5xl font-light tracking-[0.3em] uppercase text-fuchsia-900/60"
                >
                    20 Anos
                </motion.p>
            </motion.div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5, duration: 1 }}
                className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-fuchsia-400 animate-bounce z-20"
            >
                <svg
                    className="w-8 h-8"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M19 14l-7 7m0 0l-7-7m7 7V3"
                    />
                </svg>
            </motion.div>
        </section>
    );
}
