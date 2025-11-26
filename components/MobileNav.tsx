"use client";

import { MapPin, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function MobileNav() {
    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-purple-100 p-4 z-40 md:hidden flex justify-around gap-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
            <Button
                variant="ghost"
                className="flex-1 flex flex-col items-center gap-1 h-auto py-2 text-purple-700 hover:bg-purple-50 hover:text-purple-900"
                onClick={() => scrollToSection("invite")}
            >
                <MapPin size={20} />
                <span className="text-xs font-medium">Local</span>
            </Button>
            <Button
                className="flex-1 flex flex-col items-center gap-1 h-auto py-2 bg-purple-600 hover:bg-purple-700 text-white shadow-md"
                onClick={() => scrollToSection("rsvp")}
            >
                <CheckCircle size={20} />
                <span className="text-xs font-medium">Confirmar</span>
            </Button>
        </div>
    );
}
