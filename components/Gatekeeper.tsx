"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Sparkles } from "lucide-react";
import confetti from "canvas-confetti";
import pb from "@/lib/pocketbase";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import BloomingBackground from "./BloomingBackground";

interface GatekeeperProps {
    onUnlock: () => void;
}

export default function Gatekeeper({ onUnlock }: GatekeeperProps) {
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isUnlocking, setIsUnlocking] = useState(false);
    const [expectedPassword, setExpectedPassword] = useState("guid20"); // Default fallback

    useEffect(() => {
        // Fetch portal password from PocketBase
        async function fetchPassword() {
            try {
                const records = await pb.collection("config").getFullList();
                const portalPw = records.find((r: any) => r.key === "portal_password");
                if (portalPw && portalPw.value) {
                    setExpectedPassword(String(portalPw.value));
                }
            } catch (err) {
                console.error("Could not fetch portal password, using default:", err);
            }
        }
        fetchPassword();
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (password.toLowerCase() === expectedPassword.toLowerCase()) {
            setIsUnlocking(true);
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 }
            });
            setTimeout(() => {
                onUnlock();
            }, 800);
        } else {
            setError("Senha incorreta. Tente novamente.");
            setTimeout(() => setError(""), 2000);
        }
    };

    return (
        <AnimatePresence>
            {!isUnlocking && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 to-purple-50"
                >
                    <div className="absolute inset-0 overflow-hidden">
                        {[...Array(20)].map((_, i) => (
                            <motion.div
                                key={i}
                                className="absolute text-4xl opacity-20"
                                initial={{
                                    x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1200),
                                    y: -50,
                                }}
                                animate={{
                                    y: (typeof window !== 'undefined' ? window.innerHeight : 800) + 50,
                                    rotate: 360,
                                }}
                                transition={{
                                    duration: Math.random() * 10 + 10,
                                    repeat: Infinity,
                                    delay: Math.random() * 5,
                                }}
                            >
                                🌸
                            </motion.div>
                        ))}
                    </div>

                    <motion.div
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="relative z-10 w-full max-w-md px-6"
                    >
                        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-purple-100">
                            <div className="flex justify-center mb-6">
                                <div className="relative">
                                    <Lock className="w-16 h-16 text-purple-500" />
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                        className="absolute -top-2 -right-2"
                                    >
                                        <Sparkles className="w-8 h-8 text-pink-400" />
                                    </motion.div>
                                </div>
                            </div>

                            <h1 className="text-3xl font-script text-center text-purple-800 mb-2">
                                Bem-vindo!
                            </h1>
                            <p className="text-center text-gray-600 mb-6">
                                Digite a senha para acessar o convite
                            </p>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Digite a senha"
                                    className="w-full px-4 py-3 rounded-xl border-2 border-purple-200 focus:border-purple-400 focus:outline-none transition-colors text-center text-lg"
                                    autoFocus
                                />

                                {error && (
                                    <motion.p
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="text-red-500 text-sm text-center"
                                    >
                                        {error}
                                    </motion.p>
                                )}

                                <button
                                    type="submit"
                                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-xl font-medium hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg hover:shadow-xl"
                                >
                                    Entrar
                                </button>
                            </form>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
