"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserCheck, UserX, Baby } from "lucide-react";
import pb from "@/lib/pocketbase";

interface Stats {
    totalResponses: number;
    confirmedYes: number;
    confirmedNo: number;
    totalGuests: number; // confirmedYes + companions
    invitationsOpened: number; // guests who opened their invite link
    openedRate: number; // percentage of invites opened
}

export default function AdminDashboard() {
    const [stats, setStats] = useState<Stats>({
        totalResponses: 0,
        confirmedYes: 0,
        confirmedNo: 0,
        totalGuests: 0,
        invitationsOpened: 0,
        openedRate: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchStats() {
            try {
                // Fetch all records using getList with a high limit instead of getFullList if it causes issues
                // Or ensure getFullList is used correctly. 
                // The error "Something went wrong" with 400 often implies invalid params.
                // Let's try a simple getList first to verify connectivity and then handle pagination if needed.
                const records = await pb.collection("guests").getFullList();

                const totalResponses = records.length;
                const confirmedYes = records.filter((r) => r.is_confirmed).length;
                const confirmedNo = records.filter((r) => !r.is_confirmed).length;

                const totalCompanions = records
                    .filter((r) => r.is_confirmed)
                    .reduce((acc, curr) => acc + (curr.companions_count || 0), 0);

                // Calculate invitation analytics
                const invitationsOpened = records.filter((r) => r.link_opened_at).length;
                const totalInvitations = records.length;
                const openedRate = totalInvitations > 0
                    ? Math.round((invitationsOpened / totalInvitations) * 100)
                    : 0;

                setStats({
                    totalResponses,
                    confirmedYes,
                    confirmedNo,
                    totalGuests: confirmedYes + totalCompanions,
                    invitationsOpened,
                    openedRate,
                });
            } catch (error) {
                console.error("Error fetching stats:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchStats();
    }, []);

    if (loading) return <div>Carregando estatísticas...</div>;

    return (
        <div className="space-y-8">
            <h2 className="text-3xl font-bold text-gray-800">Dashboard</h2>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total de Convidados</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalGuests}</div>
                        <p className="text-xs text-muted-foreground">Confirmados + Acompanhantes</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Respostas (Sim)</CardTitle>
                        <UserCheck className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.confirmedYes}</div>
                        <p className="text-xs text-muted-foreground">Confirmaram presença</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Respostas (Não)</CardTitle>
                        <UserX className="h-4 w-4 text-red-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.confirmedNo}</div>
                        <p className="text-xs text-muted-foreground">Não poderão ir</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total de Respostas</CardTitle>
                        <Baby className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalResponses}</div>
                        <p className="text-xs text-muted-foreground">Formulários enviados</p>
                    </CardContent>
                </Card>
            </div>

            {/* Invitation Analytics */}
            <div className="grid gap-4 md:grid-cols-2 mt-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Convites Abertos</CardTitle>
                        <svg className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-blue-600">{stats.invitationsOpened}</div>
                        <p className="text-xs text-muted-foreground">de {stats.totalResponses} enviados</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Taxa de Abertura</CardTitle>
                        <svg className="h-4 w-4 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-purple-600">{stats.openedRate}%</div>
                        <p className="text-xs text-muted-foreground">dos convites enviados</p>
                    </CardContent>
                </Card>
            </div>

            {/* Link to Guests page */}
            <div className="mt-6">
                <a
                    href="/admin/guests"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-fuchsia-500 text-white rounded-lg hover:bg-fuchsia-600 transition-colors"
                >
                    Ver Lista de Convidados
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </a>
            </div>
        </div>
    );
}
