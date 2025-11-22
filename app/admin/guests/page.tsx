"use client";

import { useEffect, useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Guest } from "@/lib/pocketbase";
import pb from "@/lib/pocketbase";
import {
    Copy,
    Check,
    ExternalLink,
    Eye,
    EyeOff,
    Search,
    RefreshCw
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function GuestsPage() {
    const [guests, setGuests] = useState<Guest[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [copiedId, setCopiedId] = useState<string | null>(null);

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    const fetchGuests = async () => {
        try {
            setLoading(true);
            const records = await pb.collection("guests").getFullList<Guest>({
                sort: "-created",
            });
            setGuests(records);
        } catch (error) {
            console.error("Error fetching guests:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGuests();
    }, []);

    // const grantNotificationPermission = async () => {
    //     try {
    //         await navigator.permissions.query({ name: "notifications" });
    //     } catch (error) {
    //         console.error("Error granting notification permission:", error);
    //     }
    // };

    const copyInviteLink = (inviteCode: string, guestId: string) => {
        const link = `${baseUrl}/invite/${inviteCode}`;
        navigator.clipboard.writeText(link);
        setCopiedId(guestId);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const filteredGuests = useMemo(() => {
        return guests.filter((guest) => {
            const fullName = `${guest.first_name} ${guest.last_name || ''} `.trim();
            return fullName.toLowerCase().includes(searchTerm.toLowerCase());
        });
    }, [guests, searchTerm]);
    const stats = {
        total: guests.length,
        confirmed: guests.filter((g) => g.is_confirmed).length,
        linkOpened: guests.filter((g) => g.link_opened_at).length,
        notOpened: guests.filter((g) => !g.link_opened_at).length,
    };

    if (loading) {
        return (
            <div className="space-y-8">
                <h2 className="text-3xl font-bold text-gray-800">Gerenciar Convidados</h2>
                <div className="flex items-center justify-center py-12">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                        <RefreshCw className="w-8 h-8 text-fuchsia-500" />
                    </motion.div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold text-gray-800">Gerenciar Convidados</h2>
                <button
                    onClick={fetchGuests}
                    className="flex items-center gap-2 px-4 py-2 bg-fuchsia-500 text-white rounded-lg hover:bg-fuchsia-600 transition-colors"
                >
                    <RefreshCw className="w-4 h-4" />
                    Atualizar
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">
                            Total de Convidados
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-gray-900">{stats.total}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">
                            Confirmados
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-green-600">{stats.confirmed}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">
                            Abriram o Link
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-blue-600">{stats.linkOpened}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">
                            Não Abriram
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-orange-600">{stats.notOpened}</div>
                    </CardContent>
                </Card>
            </div>

            {/* Search Bar */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                    type="text"
                    placeholder="Buscar convidado..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-fuchsia-400 focus:outline-none transition-colors"
                />
            </div>

            {/* Guests Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Lista de Convidados ({filteredGuests.length})</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-200">
                                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Nome</th>
                                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Código</th>
                                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Link</th>
                                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Acessos</th>
                                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                <AnimatePresence mode="popLayout">
                                    {filteredGuests.map((guest) => (
                                        <motion.tr
                                            key={guest.id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                                        >
                                            <td className="py-3 px-4">
                                                <div>
                                                    <div className="font-medium text-gray-900">
                                                        {guest.first_name} {guest.last_name || ''}
                                                    </div>
                                                    <div className="text-sm text-gray-500">@{guest.first_name.toLowerCase()}</div>
                                                </div>
                                            </td>
                                            <td className="py-3 px-4">
                                                <div className="font-mono text-sm">
                                                    <div className="text-gray-600">PIN: {guest.access_code}</div>
                                                    <div className="text-fuchsia-600">{guest.invite_code}</div>
                                                </div>
                                            </td>
                                            <td className="py-3 px-4">
                                                <div className="flex flex-col gap-1">
                                                    {guest.is_confirmed ? (
                                                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium w-fit">
                                                            <Check className="w-3 h-3" />
                                                            Confirmado
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-gray-100 text-gray-600 text-xs font-medium w-fit">
                                                            Pendente
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="py-3 px-4">
                                                {guest.link_opened_at ? (
                                                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-medium">
                                                        <Eye className="w-3 h-3" />
                                                        Aberto
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-medium">
                                                        <EyeOff className="w-3 h-3" />
                                                        Não aberto
                                                    </span>
                                                )}
                                            </td>
                                            <td className="py-3 px-4">
                                                <span className="text-sm text-gray-600">
                                                    {guest.link_opened_count || 0}x
                                                </span>
                                            </td>
                                            <td className="py-3 px-4">
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => copyInviteLink(guest.invite_code, guest.id)}
                                                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-fuchsia-500 text-white text-sm hover:bg-fuchsia-600 transition-colors"
                                                    >
                                                        {copiedId === guest.id ? (
                                                            <>
                                                                <Check className="w-4 h-4" />
                                                                Copiado!
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Copy className="w-4 h-4" />
                                                                Copiar Link
                                                            </>
                                                        )}
                                                    </button>
                                                    <a
                                                        href={`${baseUrl} /invite/${guest.invite_code} `}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-300 text-gray-700 text-sm hover:bg-gray-100 transition-colors"
                                                    >
                                                        <ExternalLink className="w-4 h-4" />
                                                    </a>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </AnimatePresence>
                            </tbody>
                        </table>

                        {filteredGuests.length === 0 && (
                            <div className="text-center py-12 text-gray-500">
                                {searchTerm ? "Nenhum convidado encontrado" : "Nenhum convidado cadastrado"}
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
