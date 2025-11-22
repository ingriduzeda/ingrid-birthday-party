"use client";

import { useState } from "react";
import Gatekeeper from "@/components/Gatekeeper";
import Hero from "@/components/Hero";
import Invite from "@/components/Invite";
import RSVP from "@/components/RSVP";
import MobileNav from "@/components/MobileNav";
import Map from "@/components/Map";
import Footer from "@/components/Footer";

export default function Home() {
  const [showGatekeeper, setShowGatekeeper] = useState(true);

  const handleUnlock = () => {
    // Gatekeeper has finished its animation
    window.scrollTo(0, 0);
    setShowGatekeeper(false);
  };

  return (
    <main className="min-h-screen bg-white overflow-x-hidden font-sans">
      {showGatekeeper && <Gatekeeper onUnlock={handleUnlock} />}

      {/* Content is always rendered so it's visible behind the opening curtains */}
      <div className="relative z-0">
        <Hero />
        <Invite />
        <Map />
        <RSVP />
        <MobileNav />
        <Footer />
      </div>
    </main>
  );
}
