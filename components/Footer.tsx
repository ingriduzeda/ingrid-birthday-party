"use client";

import { motion, useAnimationControls } from "framer-motion";
import { useEffect, useState } from "react";
import pb from "@/lib/pocketbase";
import { Heart, Quote } from "lucide-react";

interface GuestMessage {
    id: string;
    name: string;
    message: string;
}

export default function Footer() {
    const [messages, setMessages] = useState<GuestMessage[]>([]);
    const [isMounted, setIsMounted] = useState(false);
    const controls = useAnimationControls();

    // Initialize client-side rendering to prevent hydration mismatch
    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        async function fetchMessages() {
            try {
                const records = await pb.collection("guests").getFullList({
                    filter: 'message != ""',
                    sort: '-created',
                });

                const guestMessages = records
                    .filter((r: any) => r.message && r.message.trim().length > 0)
                    .map((r: any) => ({
                        id: r.id,
                        name: r.name || "Convidado",
                        message: r.message,
                    }));

                setMessages(guestMessages);
            } catch (err) {
                console.error("Error fetching guest messages:", err);
                // Fallback sample data
                const sampleMessages = [
                    { id: "1", name: "Ana", message: "Parabéns, Ingrid! Que esse novo ciclo seja repleto de amor e felicidade! ✨" },
                    { id: "2", name: "Carlos", message: "Feliz aniversário! 20 anos nunca foram tão incríveis! Aproveite seu dia." },
                    { id: "3", name: "Mariana", message: "Ingrid, você merece tudo de melhor! Continue sendo essa luz na nossa vida." },
                    { id: "4", name: "Pedro", message: "Que seus 20 anos sejam apenas o começo de grandes conquistas! Sucesso!" },
                    { id: "5", name: "Juliana", message: "Parabéns! Mal posso esperar para celebrar com você. Te adoro!" },
                ];
                setMessages(sampleMessages);
            }
        }

        fetchMessages();

        // Silent refresh every 30 seconds (doesn't break animation unless list changes drastically)
        const interval = setInterval(fetchMessages, 30000);
        return () => clearInterval(interval);
    }, []);

    // Prepare data for infinite scroll
    // We ensure we have enough items to fill width, then duplicate the set for the loop
    const scrollItems = messages.length > 0 ? [...messages, ...messages] : [];

    // Dynamic duration: More items = longer time to scroll (keeps speed consistent)
    const duration = messages.length > 0 ? messages.length * 8 : 20;

    return (
        <footer className="relative w-full bg-gradient-to-br from-fuchsia-950 via-purple-900 to-indigo-950 text-white overflow-hidden pb-10 pt-20">

            {/* 1. Floating Petals (Hydration Safe) */}
            {isMounted && (
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    {[...Array(12)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute text-pink-300/20 text-4xl"
                            initial={{
                                x: Math.random() * window.innerWidth,
                                y: -100,
                                rotate: 0,
                            }}
                            animate={{
                                y: window.innerHeight + 100,
                                x: `calc(${Math.random() * 100}vw + ${Math.random() * 200 - 100}px)`,
                                rotate: 360,
                            }}
                            transition={{
                                duration: Math.random() * 10 + 15,
                                repeat: Infinity,
                                delay: Math.random() * 10,
                                ease: "linear",
                            }}
                        >
                            🌸
                        </motion.div>
                    ))}
                </div>
            )}

            <div className="relative z-10">
                {/* 2. Header Section */}
                <div className="text-center mb-10 px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="inline-block"
                    >
                        <h3 className="text-3xl md:text-4xl font-script text-fuchsia-100 mb-3 flex items-center justify-center gap-3">
                            <Heart className="w-6 h-6 fill-fuchsia-400 text-fuchsia-400 animate-pulse" />
                            Mural de Carinho
                            <Heart className="w-6 h-6 fill-fuchsia-400 text-fuchsia-400 animate-pulse" />
                        </h3>
                        <div className="h-1 w-24 bg-gradient-to-r from-transparent via-fuchsia-400 to-transparent mx-auto rounded-full" />
                    </motion.div>
                    <p className="text-white/60 text-sm mt-4 max-w-md mx-auto">
                        Mensagens especiais deixadas pelos amigos e família
                    </p>
                </div>

                {/* 3. Infinite Scrolling Marquee */}
                {messages.length > 0 && (
                    <div className="relative w-full overflow-hidden py-8 group">

                        {/* Fade Gradients on sides */}
                        <div className="absolute left-0 top-0 bottom-0 w-12 md:w-32 bg-gradient-to-r from-fuchsia-950 to-transparent z-20 pointer-events-none" />
                        <div className="absolute right-0 top-0 bottom-0 w-12 md:w-32 bg-gradient-to-l from-fuchsia-950 to-transparent z-20 pointer-events-none" />

                        <div className="flex">
                            <motion.div
                                className="flex gap-6 px-6"
                                animate={{
                                    x: ["0%", "-50%"], // Move exactly half the total width
                                }}
                                transition={{
                                    duration: duration, // Calculated based on item count
                                    repeat: Infinity,
                                    ease: "linear",
                                }}
                                // Hack to pause on hover: We slow it down drastically or stop
                                style={{ width: "max-content" }}
                            >
                                {scrollItems.map((msg, index) => (
                                    <div
                                        key={`${msg.id}-${index}`}
                                        className="relative w-[280px] md:w-[320px] flex-shrink-0 group/card"
                                    >
                                        <div className="h-full bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 transition-all duration-300 hover:bg-white/10 hover:border-fuchsia-400/30 hover:-translate-y-1 hover:shadow-xl hover:shadow-fuchsia-900/20">
                                            {/* Quote Icon decoration */}
                                            <Quote className="absolute top-4 right-4 w-8 h-8 text-white/5 fill-white/5 group-hover/card:text-fuchsia-400/20 transition-colors" />

                                            <div className="flex flex-col h-full">
                                                <p className="text-white/90 italic text-sm md:text-base leading-relaxed mb-4 flex-grow">
                                                    "{msg.message}"
                                                </p>

                                                <div className="flex items-center gap-3 pt-4 border-t border-white/5">
                                                    <div className="w-8 h-8 bg-gradient-to-tr from-fuchsia-500 to-purple-500 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-lg">
                                                        {msg.name.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-fuchsia-200 text-sm">
                                                            {msg.name}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </motion.div>
                        </div>
                    </div>
                )}

                {/* 4. Final Signature */}
                <div className="mt-12 pt-8 border-t border-white/5 text-center px-4">
                    <div className="flex flex-col items-center gap-4">
                        <h2 className="text-5xl font-script text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-200 to-purple-200">
                            Ingrid
                        </h2>
                        <div className="flex items-center gap-2 text-white/40 text-xs uppercase tracking-widest">
                            <span>07 Dez 2025</span>
                            <span className="w-1 h-1 bg-fuchsia-500 rounded-full" />
                            <span>Salvador - BA</span>
                        </div>
                        <p className="text-white/20 text-xs mt-4 flex items-center gap-1">
                            Desenvolvido com <Heart className="w-3 h-3 text-fuchsia-500 fill-fuchsia-500" />
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}