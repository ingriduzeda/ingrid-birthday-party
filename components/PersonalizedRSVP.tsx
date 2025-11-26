"use client";

import { useState, useEffect } from "react";
import { Guest } from "@/lib/pocketbase";
import pb from "@/lib/pocketbase";
import { motion } from "framer-motion";
import { Check, X, Heart, MessageSquare } from "lucide-react";
import confetti from "canvas-confetti";

interface PersonalizedRSVPProps {
    guest: Guest;
}

export default function PersonalizedRSVP({ guest }: PersonalizedRSVPProps) {
    const [isConfirmed, setIsConfirmed] = useState(guest.is_confirmed);
    const [companionsCount, setCompanionsCount] = useState(guest.companions_count || 0);
    const [message, setMessage] = useState(guest.message || "");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [submitError, setSubmitError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitError("");

        try {
            await pb.collection("guests").update(guest.id, {
                is_confirmed: isConfirmed,
                companions_count: companionsCount,
                message: message,
            });

            setSubmitSuccess(true);

            if (isConfirmed) {
                confetti({
                    particleCount: 100,
                    spread: 70,
                    origin: { y: 0.6 },
                });
            }

            setTimeout(() => {
                setSubmitSuccess(false);
            }, 5000);
        } catch (error: any) {
            console.error("Error submitting RSVP:", error);
            setSubmitError("Erro ao enviar confirmação. Por favor, tente novamente.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section id="rsvp" className="py-16 px-4 bg-gradient-to-br from-purple-50 via-pink-50 to-purple-50">
            <div className="max-w-2xl mx-auto">
                <motion.div
                    initial={{ y: 20 }}
                    whileInView={{ y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    <h2 className="text-4xl md:text-5xl font-script text-center text-purple-800 mb-4">
                        Confirme sua Presença
                    </h2>
                    <p className="text-center text-gray-600 mb-8">
                        {guest.first_name}, adoraríamos contar com você neste dia especial!
                    </p>

                    <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-purple-100">
                        {submitSuccess && (
                            <motion.div
                                initial={{ y: -10 }}
                                animate={{ y: 0 }}
                                className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3"
                            >
                                <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                                <p className="text-green-800">
                                    {isConfirmed
                                        ? "🎉 Que alegria! Sua presença foi confirmada!"
                                        : "Recebemos sua resposta. Sentiremos sua falta!"}
                                </p>
                            </motion.div>
                        )}

                        {submitError && (
                            <motion.div
                                initial={{ y: -10 }}
                                animate={{ y: 0 }}
                                className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3"
                            >
                                <X className="w-5 h-5 text-red-600 flex-shrink-0" />
                                <p className="text-red-800">{submitError}</p>
                            </motion.div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Guest Name (Read-only) */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Nome
                                </label>
                                <div className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-gray-50 text-gray-600">
                                    {guest.first_name} {guest.last_name || ''}
                                </div>
                            </div>

                            {/* Confirmation Toggle */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-3">
                                    Você poderá comparecer?
                                </label>
                                <div className="grid grid-cols-2 gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setIsConfirmed(true)}
                                        className={`py-4 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${isConfirmed
                                            ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg scale-105"
                                            : "bg-white border-2 border-gray-200 text-gray-700 hover:border-green-300"
                                            }`}
                                    >
                                        <Check className="w-5 h-5" />
                                        Sim, vou!
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setIsConfirmed(false)}
                                        className={`py-4 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${!isConfirmed
                                            ? "bg-gradient-to-r from-gray-400 to-gray-500 text-white shadow-lg scale-105"
                                            : "bg-white border-2 border-gray-200 text-gray-700 hover:border-gray-300"
                                            }`}
                                    >
                                        <X className="w-5 h-5" />
                                        Não poderei
                                    </button>
                                </div>
                            </div>

                            {/* Companions Count (only if confirmed) */}
                            {isConfirmed && (
                                <motion.div
                                    initial={{ height: 0 }}
                                    animate={{ height: "auto" }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Quantos acompanhantes?
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        max="10"
                                        value={companionsCount}
                                        onChange={(e) => setCompanionsCount(parseInt(e.target.value) || 0)}
                                        className="w-full px-4 py-3 rounded-xl border-2 border-purple-200 focus:border-purple-400 focus:outline-none transition-colors"
                                        placeholder="0"
                                    />
                                    <p className="text-sm text-gray-500 mt-1">
                                        Apenas acompanhantes, sem contar você
                                    </p>
                                </motion.div>
                            )}

                            {/* Optional Message */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                    <MessageSquare className="w-4 h-4" />
                                    Mensagem (opcional)
                                </label>
                                <textarea
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    rows={4}
                                    className="w-full px-4 py-3 rounded-xl border-2 border-purple-200 focus:border-purple-400 focus:outline-none transition-colors resize-none"
                                    placeholder="Deixe uma mensagem carinhosa para a aniversariante..."
                                />
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 rounded-xl font-medium hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {isSubmitting ? (
                                    <>Enviando...</>
                                ) : (
                                    <>
                                        <Heart className="w-5 h-5" />
                                        Confirmar
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
