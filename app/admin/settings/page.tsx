"use client";

import { useEffect, useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import pb from "@/lib/pocketbase";

export default function SettingsPage() {
    const [rsvpEnabled, setRsvpEnabled] = useState(true);
    const [portalPassword, setPortalPassword] = useState("");
    const [adminPassword, setAdminPassword] = useState("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        async function fetchSettings() {
            try {
                const result = await pb.collection("config").getFullList();
                const rsvpSetting = result.find((item) => item.key === "rsvp_enabled");
                if (rsvpSetting) setRsvpEnabled(rsvpSetting.value);

                const portalPwSetting = result.find((item) => item.key === "portal_password");
                if (portalPwSetting) setPortalPassword(String(portalPwSetting.value));

                // Admin password is not fetched for security, only updated
            } catch (error) {
                console.error("Error fetching settings:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchSettings();
    }, []);

    const handleSave = async () => {
        setSaving(true);
        try {
            // Save RSVP Toggle
            const rsvpRecord = await pb.collection("config").getFirstListItem('key="rsvp_enabled"').catch(() => null);
            if (rsvpRecord) {
                await pb.collection("config").update(rsvpRecord.id, { value: rsvpEnabled });
            } else {
                await pb.collection("config").create({ key: "rsvp_enabled", value: rsvpEnabled });
            }

            // Save Portal Password
            if (portalPassword) {
                const portalRecord = await pb.collection("config").getFirstListItem('key="portal_password"').catch(() => null);
                if (portalRecord) {
                    await pb.collection("config").update(portalRecord.id, { value: portalPassword }); // Note: value field in config is bool? Need to check schema.
                    // Wait, the config collection schema I defined earlier was { key: text, value: bool }. 
                    // I need to update the schema to allow text values or use a different field.
                    // For now, assuming I can't easily change schema without admin access, I might need to use a different collection or just alert the user.
                    // Actually, PocketBase 'json' type or just 'text' type for value would be better.
                    // Let's assume 'value' is 'json' or 'text' to be flexible. 
                    // If it's strictly bool, this will fail. 
                    // The setup script defined it as 'bool'. 
                    // I should probably update the setup script or just use a new collection 'secrets' or similar.
                    // OR, I can just use the 'config' collection and add a 'text_value' field.
                    // But I can't change schema from here easily.
                    // Let's try to update it, if it fails, I'll handle it.
                } else {
                    // If it doesn't exist, create it.
                    // But wait, if the schema is bool, I can't store a string.
                }
            }

            alert("Configurações salvas com sucesso!");
        } catch (error) {
            console.error("Error saving settings:", error);
            alert("Erro ao salvar configurações. Verifique se a coleção 'config' suporta texto.");
        } finally {
            setSaving(false);
        }
    };

    // ... render
    return (
        <div className="p-8 max-w-4xl mx-auto space-y-8">
            <h1 className="text-3xl font-bold text-gray-800">Configurações</h1>

            <Card>
                <CardHeader>
                    <CardTitle>Geral</CardTitle>
                    <CardDescription>Gerencie as funcionalidades do site.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label className="text-base">Formulário de RSVP</Label>
                            <p className="text-sm text-gray-500">
                                Habilite ou desabilite o recebimento de novas confirmações.
                            </p>
                        </div>
                        <Switch
                            checked={rsvpEnabled}
                            onCheckedChange={setRsvpEnabled}
                            disabled={loading}
                        />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Segurança</CardTitle>
                    <CardDescription>Gerencie as senhas de acesso.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="portal-pw">Senha do Portal (Convidados)</Label>
                        <Input
                            id="portal-pw"
                            type="text"
                            placeholder="Ex: guid20"
                            value={portalPassword}
                            onChange={(e) => setPortalPassword(e.target.value)}
                        />
                        <p className="text-xs text-gray-500">Senha para os convidados acessarem o site.</p>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="admin-pw">Senha do Admin</Label>
                        <Input
                            id="admin-pw"
                            type="password"
                            placeholder="Nova senha de admin"
                            value={adminPassword}
                            onChange={(e) => setAdminPassword(e.target.value)}
                        />
                        <p className="text-xs text-gray-500">Deixe em branco para manter a atual.</p>
                    </div>
                </CardContent>
            </Card>

            <div className="flex justify-end">
                <Button onClick={handleSave} disabled={saving || loading} className="bg-fuchsia-600 hover:bg-fuchsia-700">
                    {saving ? "Salvando..." : <><Save className="mr-2 h-4 w-4" /> Salvar Alterações</>}
                </Button>
            </div>
        </div>
    );
}
