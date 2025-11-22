"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import pb from "@/lib/pocketbase";

export default function AdminLogin() {
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [expectedPassword, setExpectedPassword] = useState("admin2025"); // Default fallback
    const router = useRouter();

    useEffect(() => {
        // Fetch admin password from PocketBase
        async function fetchPassword() {
            try {
                const records = await pb.collection("config").getFullList();
                const adminPw = records.find((r: any) => r.key === "admin_password");
                if (adminPw && adminPw.value) {
                    setExpectedPassword(String(adminPw.value));
                }
            } catch (err) {
                console.error("Could not fetch admin password, using default:", err);
            }
        }
        fetchPassword();
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        // Check password
        if (password === expectedPassword) {
            // Set cookie for auth
            document.cookie = "admin_auth=true; path=/; max-age=86400";
            router.push("/admin");
        } else {
            setError("Senha incorreta");
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="w-full max-w-md p-8">
                <div className="bg-white rounded-xl shadow-lg p-8">
                    <div className="flex justify-center mb-6">
                        <div className="bg-fuchsia-100 p-4 rounded-full">
                            <Lock className="w-8 h-8 text-fuchsia-600" />
                        </div>
                    </div>

                    <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">
                        Admin Login
                    </h1>
                    <p className="text-center text-gray-600 mb-8">
                        Acesso restrito ao painel administrativo
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="password">Senha</Label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Digite a senha de admin"
                                required
                                disabled={loading}
                            />
                        </div>

                        {error && (
                            <p className="text-sm text-red-600 text-center">{error}</p>
                        )}

                        <Button
                            type="submit"
                            className="w-full bg-fuchsia-600 hover:bg-fuchsia-700"
                            disabled={loading}
                        >
                            {loading ? "Entrando..." : "Entrar"}
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
}
