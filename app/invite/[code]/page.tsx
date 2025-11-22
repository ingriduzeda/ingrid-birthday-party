"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import pb from "@/lib/pocketbase";
import { Guest } from "@/lib/pocketbase";
import Hero from "@/components/Hero";
import Invite from "@/components/Invite";
import Map from "@/components/Map";
import PersonalizedRSVP from "@/components/PersonalizedRSVP";
import MobileNav from "@/components/MobileNav";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { Heart, PartyPopper } from "lucide-react";

export default function InvitePage() {
    const params = useParams();
    const router = useRouter();
    const code = params?.code as string;

    const [guest, setGuest] = useState<Guest | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchGuest() {
            try {
                // Fetch guest by invite code
                const records = await pb.collection("guests").getList<Guest>(1, 1, {
                    filter: `invite_code = "${code}"`,
                });

                if (records.items.length === 0) {
                    setError("Convite não encontrado. Verifique o link e tente novamente.");
                    setLoading(false);
                    return;
                }

                const guestData = records.items[0];
                setGuest(guestData);

                // Track link opening analytics
                const updates: any = {
                    link_opened_count: (guestData.link_opened_count || 0) + 1,
                };

                // Set first opened timestamp if not already set
                if (!guestData.link_opened_at) {
                    updates.link_opened_at = new Date().toISOString();
                }

                // Update analytics in background (don't await)
                pb.collection("guests").update(guestData.id, updates).catch((err) => {
                    console.error("Failed to update analytics:", err);
                });

                setLoading(false);
            } catch (err: any) {
                console.error("Error fetching guest:", err);
                setError("Erro ao carregar o convite. Por favor, tente novamente.");
                setLoading(false);
            }
        }

        if (code) {
            fetchGuest();
        }
    }, [code]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-fuchsia-50 via-pink-50 to-purple-50 flex items-center justify-center">
                <div className="text-center">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="inline-block mb-4"
                    >
                        <PartyPopper className="w-16 h-16 text-fuchsia-500" />
                    </motion.div>
                    <p className="text-xl text-gray-600">Carregando seu convite...</p>
                </div>
            </div>
        );
    }

    if (error || !guest) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-fuchsia-50 via-pink-50 to-purple-50 flex items-center justify-center px-4">
                <div className="max-w-md w-full bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 text-center">
                    <div className="text-6xl mb-4">😢</div>
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">Oops!</h1>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <button
                        onClick={() => router.push("/")}
                        className="bg-gradient-to-r from-fuchsia-500 to-pink-500 text-white px-6 py-3 rounded-xl font-medium hover:from-fuchsia-600 hover:to-pink-600 transition-all shadow-lg"
                    >
                        Ir para página inicial
                    </button>
                </div>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-white overflow-x-hidden font-sans">
            {/* Personalized Welcome Section */}
            <div className="bg-gradient-to-br from-fuchsia-50 via-pink-50 to-purple-50 py-16 px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="max-w-4xl mx-auto text-center"
                >
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                        className="inline-block mb-4"
                    >
                        <Heart className="w-16 h-16 text-fuchsia-500 fill-fuchsia-500" />
                    </motion.div>

                    <h1 className="text-5xl md:text-6xl font-script text-fuchsia-800 mb-4">
                        Olá, {guest.first_name}!
                    </h1>

                    <p className="text-xl md:text-2xl text-gray-700 mb-6">
                        Você está convidado(a) para celebrar os 20 anos da Guid!
                    </p>

                    <div className="inline-flex items-center gap-2 bg-white/60 backdrop-blur px-6 py-3 rounded-full border border-fuchsia-200">
                        <PartyPopper className="w-5 h-5 text-fuchsia-600" />
                        <span className="text-fuchsia-800 font-medium">
                            Este é o seu convite personalizado
                        </span>
                    </div>
                </motion.div>
            </div>

            {/* Main Content */}
            <div className="relative z-0">
                <Hero />
                <Invite />
                <Map />
                <PersonalizedRSVP guest={guest} />
                <MobileNav />
                <Footer />
            </div>
        </main>
    );
}
