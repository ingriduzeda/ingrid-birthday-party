"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const Petal = ({ delay }: { delay: number }) => {
    const randomX = Math.random() * 100;
    const randomDuration = 10 + Math.random() * 10;
    const randomSize = 10 + Math.random() * 20;

    return (
        <motion.div
            initial={{ y: -100, x: `${randomX}vw`, opacity: 0, rotate: 0 }}
            animate={{
                y: "100vh",
                opacity: [0, 1, 0],
                rotate: 360,
                x: [`${randomX}vw`, `${randomX + (Math.random() * 10 - 5)}vw`],
            }}
            transition={{
                duration: randomDuration,
                repeat: Infinity,
                delay: delay,
                ease: "linear",
            }}
            className="absolute top-0 pointer-events-none z-0"
            style={{
                width: randomSize,
                height: randomSize,
                background: "radial-gradient(circle, rgba(255,200,255,0.8) 0%, rgba(255,255,255,0) 70%)",
                borderRadius: "50% 0 50% 0",
            }}
        />
    );
};

export default function BloomingBackground() {
    const [petals, setPetals] = useState<number[]>([]);

    useEffect(() => {
        setPetals(Array.from({ length: 20 }, (_, i) => i));
    }, []);

    return (
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-white to-purple-50 opacity-80" />
            {petals.map((i) => (
                <Petal key={i} delay={i * 0.5} />
            ))}
        </div>
    );
}
