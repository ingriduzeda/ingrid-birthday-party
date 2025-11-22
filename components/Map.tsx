
"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";

export default function Map() {
    // Correct embed URL for Condo Villa Privilege with proper marker
    const mapUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3224.8181022309627!2d-38.482519100000005!3d-12.971412099999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x7161b2ba89091bf%3A0x1fc354f0df08d9aa!2sCondo%20Villa%20Privilege!5e1!3m2!1sen!2sbr!4v1763765240850!5m2!1sen!2sbr";
    const locationUrl = "https://maps.app.goo.gl/RrecVo4MaBXGbYmy5";

    return (
        <section className="py-20 px-4 bg-white">
            <div className="max-w-5xl mx-auto">
                <div className="text-center mb-12">
                    <motion.h2
                        initial={{ opacity: 0.6 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ margin: "-50px", once: true }}
                        className="text-4xl font-script text-fuchsia-800 mb-4"
                    >
                        Como Chegar
                    </motion.h2>
                    <p className="text-gray-700 max-w-md mx-auto font-medium">
                        Rua Raul Leite, 1470, Condomínio Villa Privilege - Vila Laura, Salvador - BA, 40270-180
                    </p>
                </div>

                <div className="relative rounded-3xl overflow-hidden shadow-xl border-4 border-fuchsia-100 h-[400px] md:h-[500px]">
                    <iframe
                        src={mapUrl}
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen
                        loading="lazy"
                        className="filter grayscale hover:grayscale-0 transition-all duration-500"
                    ></iframe>

                    <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 w-full px-4 md:w-auto">
                        <Button
                            asChild
                            className="bg-white text-fuchsia-800 hover:bg-fuchsia-50 shadow-lg rounded-full px-8 py-6 text-lg font-medium border border-fuchsia-200 w-full md:w-auto"
                        >
                            <a
                                href={locationUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <MapPin className="mr-2" />
                                Abrir no Maps
                            </a>
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
}

