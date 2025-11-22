"use client";

import { motion } from "framer-motion";
import { CalendarPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MapPin, Clock } from "lucide-react";

export default function Invite() {
    return (
        <section id="invite" className="py-20 px-4 bg-fuchsia-50 flex justify-center items-center min-h-[60vh]">
            <motion.div
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="max-w-3xl w-full"
            >
                <div className="relative bg-white rounded-3xl shadow-xl overflow-hidden border border-fuchsia-100 flex flex-col md:flex-row">
                    {/* Left Side - Decorative */}
                    <div className="bg-fuchsia-600 p-8 md:w-1/3 flex flex-col justify-center items-center text-white relative overflow-hidden">
                        <div className="absolute inset-0 opacity-20 bg-[url('/images/gallery-1.jpg')] bg-cover bg-center mix-blend-overlay" />
                        <div className="relative z-10 text-center">
                            <span className="text-6xl font-script mb-2 block">07</span>
                            <span className="text-xl uppercase tracking-widest block">Dezembro</span>
                            <span className="text-2xl font-light block mt-2">2025</span>
                        </div>
                        {/* Ticket notch */}
                        <div className="absolute -right-4 top-1/2 w-8 h-8 bg-fuchsia-50 rounded-full transform -translate-y-1/2 z-20 hidden md:block" />
                        <div className="absolute -bottom-4 left-1/2 w-8 h-8 bg-fuchsia-50 rounded-full transform -translate-x-1/2 z-20 md:hidden" />
                    </div>

                    {/* Right Side - Details */}
                    <div className="p-8 md:w-2/3 flex flex-col justify-center relative">
                        {/* Ticket notch */}
                        <div className="absolute -left-4 top-1/2 w-8 h-8 bg-fuchsia-50 rounded-full transform -translate-y-1/2 z-20 hidden md:block" />
                        <div className="absolute -top-4 left-1/2 w-8 h-8 bg-fuchsia-50 rounded-full transform -translate-x-1/2 z-20 md:hidden" />

                        <h2 className="text-4xl font-script text-fuchsia-800 mb-8 text-center md:text-left mt-4 md:mt-0">
                            Você é nosso convidado especial
                        </h2>

                        <div className="space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-fuchsia-100 rounded-full flex items-center justify-center text-fuchsia-600 shrink-0">
                                    <Clock size={24} />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-800">Horário</h3>
                                    <p className="text-gray-600">18:00h</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-fuchsia-100 rounded-full flex items-center justify-center text-fuchsia-600 shrink-0">
                                    <MapPin size={24} />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-800">Localização</h3>
                                    <p className="text-gray-600">Condomínio Villa Privilege</p>
                                    <p className="text-sm text-gray-500">Rua Raul Leite, 1470 - Vila Laura, Salvador - BA</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 pt-6 border-t border-dashed border-gray-200 text-center md:text-left">
                            <p className="text-fuchsia-600 italic">
                                "Sua presença é o melhor presente!"
                            </p>
                        </div>
                        <div className="mt-8 flex justify-center">
                            <Button
                                variant="outline"
                                className="border-fuchsia-200 text-fuchsia-700 hover:bg-fuchsia-50"
                                onClick={() => {
                                    const event = {
                                        title: "Aniversário de 20 Anos da Ingrid",
                                        description: "Venha celebrar comigo este momento especial!",
                                        location: "Rua Raul Leite, 1470, Condomínio Villa Privilege - Vila Laura, Salvador - BA, 40270-180",
                                        start: "20251207T180000",
                                        end: "20251208T020000",
                                    };
                                    const googleUrl = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&details=${encodeURIComponent(event.description)}&location=${encodeURIComponent(event.location)}&dates=${event.start}/${event.end}`;
                                    window.open(googleUrl, "_blank");
                                }}
                            >
                                <CalendarPlus className="mr-2 h-4 w-4" />
                                Adicionar ao Calendário
                            </Button>
                        </div>
                    </div>
                </div>
            </motion.div>
        </section>
    );
}
