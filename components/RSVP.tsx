"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { Loader2, CheckCircle, XCircle, ArrowRight, ArrowLeft, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import pb from "@/lib/pocketbase";

export default function RSVP() {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");
    const [step, setStep] = useState(1);

    const [formData, setFormData] = useState({
        first_name: "",
        is_confirmed: "yes",
        companions_count: 0,
        message: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const nextStep = () => setStep(s => s + 1);
    const prevStep = () => setStep(s => s - 1);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            await pb.collection("guests").create({
                first_name: formData.first_name,
                is_confirmed: formData.is_confirmed === "yes",
                companions_count: Number(formData.companions_count),
                message: formData.message,
            });

            setSuccess(true);
            if (formData.is_confirmed === "yes") {
                confetti({
                    particleCount: 150,
                    spread: 70,
                    origin: { y: 0.6 },
                    colors: ["#d946ef", "#a21caf", "#f0abfc"],
                });
            }
        } catch (err: any) {
            console.error("Error submitting RSVP:", err);
            if (err.status === 404) {
                setError("Erro de configuração: Coleção não encontrada. Contate o administrador.");
            } else {
                setError("Ocorreu um erro ao confirmar. Tente novamente.");
            }
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <section id="rsvp" className="py-20 px-4 bg-white flex justify-center items-center min-h-[50vh] relative z-10">
                <div
                    className="text-center max-w-md"
                >
                    <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600 shadow-lg">
                        <CheckCircle size={48} />
                    </div>
                    <h2 className="text-4xl font-script text-purple-800 mb-4">Obrigado!</h2>
                    <p className="text-gray-600 text-lg">
                        Sua resposta foi enviada com sucesso.
                        {formData.is_confirmed === "yes"
                            ? " Mal podemos esperar para celebrar com você!"
                            : " Sentiremos sua falta!"}
                    </p>
                </div>
            </section>
        );
    }

    return (
        <section id="rsvp" className="py-20 px-4 bg-white relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-purple-50 to-white" />

            <div
                className="max-w-2xl mx-auto relative z-10"
            >
                <Card className="border-none shadow-2xl bg-white/80 backdrop-blur-sm overflow-hidden">
                    <div className="h-2 bg-purple-100 w-full">
                        <motion.div
                            className="h-full bg-purple-600"
                            initial={{ width: "0%" }}
                            animate={{ width: `${(step / 3) * 100}%` }}
                        />
                    </div>
                    <CardHeader className="text-center pb-2">
                        <CardTitle className="text-4xl font-script text-purple-800">Confirme sua Presença</CardTitle>
                        <p className="text-gray-500 mt-2">Por favor, confirme até o dia 30/11</p>
                    </CardHeader>
                    <CardContent className="p-6 md:p-10 min-h-[400px] flex flex-col justify-center">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <AnimatePresence mode="wait">
                                {step === 1 && (
                                    <motion.div
                                        key="step1"
                                        initial={{ x: 20 }}
                                        animate={{ x: 0 }}
                                        exit={{ x: -20 }}
                                        className="space-y-6"
                                    >
                                        <div className="space-y-4">
                                            <Label htmlFor="first_name" className="text-xl text-purple-900">Como podemos te chamar?</Label>
                                            <Input
                                                id="first_name"
                                                name="first_name"
                                                placeholder="Digite seu nome completo"
                                                required
                                                value={formData.first_name}
                                                onChange={handleChange}
                                                className="text-lg py-6 border-purple-200 focus:ring-purple-400"
                                                autoFocus
                                            />
                                        </div>
                                        <div className="flex justify-end">
                                            <Button
                                                type="button"
                                                onClick={nextStep}
                                                disabled={!formData.first_name}
                                                className="bg-purple-600 hover:bg-purple-700 text-white rounded-full px-8 py-6 text-lg"
                                            >
                                                Próximo <ArrowRight className="ml-2" />
                                            </Button>
                                        </div>
                                    </motion.div>
                                )}

                                {step === 2 && (
                                    <motion.div
                                        key="step2"
                                        initial={{ x: 20 }}
                                        animate={{ x: 0 }}
                                        exit={{ x: -20 }}
                                        className="space-y-6"
                                    >
                                        <div className="space-y-4">
                                            <Label className="text-xl text-purple-900">Você poderá comparecer?</Label>
                                            <RadioGroup
                                                defaultValue="yes"
                                                value={formData.is_confirmed}
                                                onValueChange={(val) => setFormData(prev => ({ ...prev, is_confirmed: val }))}
                                                className="grid grid-cols-1 md:grid-cols-2 gap-4"
                                            >
                                                <div className={`flex items-center space-x-2 border-2 p-4 rounded-xl cursor-pointer transition-all ${formData.is_confirmed === 'yes' ? 'border-purple-500 bg-purple-50' : 'border-gray-200 hover:border-purple-200'}`}>
                                                    <RadioGroupItem value="yes" id="r1" className="text-purple-600" />
                                                    <Label htmlFor="r1" className="cursor-pointer flex-1 font-medium">Sim, com certeza!</Label>
                                                </div>
                                                <div className={`flex items-center space-x-2 border-2 p-4 rounded-xl cursor-pointer transition-all ${formData.is_confirmed === 'no' ? 'border-purple-500 bg-purple-50' : 'border-gray-200 hover:border-purple-200'}`}>
                                                    <RadioGroupItem value="no" id="r2" className="text-purple-600" />
                                                    <Label htmlFor="r2" className="cursor-pointer flex-1 font-medium">Infelizmente não</Label>
                                                </div>
                                            </RadioGroup>
                                        </div>

                                        {formData.is_confirmed === "yes" && (
                                            <motion.div
                                                initial={{ height: 0 }}
                                                animate={{ height: "auto" }}
                                                className="space-y-2 overflow-hidden"
                                            >
                                                <Label htmlFor="companions_count" className="text-lg text-purple-900">Quantos acompanhantes?</Label>
                                                <Input
                                                    id="companions_count"
                                                    name="companions_count"
                                                    type="number"
                                                    min="0"
                                                    max="5"
                                                    value={formData.companions_count}
                                                    onChange={handleChange}
                                                    className="text-lg py-6 border-purple-200 focus:ring-purple-400"
                                                />
                                            </motion.div>
                                        )}

                                        <div className="flex justify-between">
                                            <Button type="button" variant="ghost" onClick={prevStep} className="text-gray-500">
                                                <ArrowLeft className="mr-2" /> Voltar
                                            </Button>
                                            <Button
                                                type="button"
                                                onClick={nextStep}
                                                className="bg-purple-600 hover:bg-purple-700 text-white rounded-full px-8 py-6 text-lg"
                                            >
                                                Próximo <ArrowRight className="ml-2" />
                                            </Button>
                                        </div>
                                    </motion.div>
                                )}

                                {step === 3 && (
                                    <motion.div
                                        key="step3"
                                        initial={{ x: 20 }}
                                        animate={{ x: 0 }}
                                        exit={{ x: -20 }}
                                        className="space-y-6"
                                    >
                                        <div className="space-y-4">
                                            <Label htmlFor="message" className="text-xl text-purple-900">Deixe uma mensagem (Opcional)</Label>
                                            <Textarea
                                                id="message"
                                                name="message"
                                                placeholder="Escreva algo especial para a Ingrid..."
                                                value={formData.message}
                                                onChange={handleChange}
                                                className="border-purple-200 focus:ring-purple-400 min-h-[120px] text-lg p-4"
                                            />
                                        </div>

                                        {error && (
                                            <div className="text-red-500 text-sm flex items-center gap-2 bg-red-50 p-3 rounded-md">
                                                <XCircle size={16} /> {error}
                                            </div>
                                        )}

                                        <div className="flex justify-between items-center pt-4">
                                            <Button type="button" variant="ghost" onClick={prevStep} className="text-gray-500">
                                                <ArrowLeft className="mr-2" /> Voltar
                                            </Button>
                                            <Button
                                                type="submit"
                                                disabled={loading}
                                                className="bg-gradient-to-r from-purple-600 to-purple-600 hover:from-purple-700 hover:to-purple-700 text-white rounded-full px-10 py-6 text-lg shadow-lg hover:shadow-purple-500/30 transition-all"
                                            >
                                                {loading ? <Loader2 className="animate-spin mr-2" /> : <><Sparkles className="mr-2" /> Confirmar</>}
                                            </Button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </section>
    );
}
