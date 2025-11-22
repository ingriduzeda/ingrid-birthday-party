import { Metadata } from "next";
import pb from "@/lib/pocketbase";
import { Guest } from "@/lib/pocketbase";

interface Props {
    params: { code: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { code } = await params;

    try {
        // Fetch guest to get their name
        const records = await pb.collection("guests").getList<Guest>(1, 1, {
            filter: `invite_code = "${code}"`,
        });

        if (records.items.length > 0) {
            const guest = records.items[0];
            const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

            return {
                title: `Convite para ${guest.first_name} ${guest.last_name || ''} - 20 anos da Guid`,
                description: `${guest.first_name}, você está convidado(a) para celebrar os 20 anos da Guid! 07 de Dezembro de 2025.`,
                openGraph: {
                    title: `Convite para ${guest.first_name} ${guest.last_name || ''}`,
                    description: "Venha comemorar os 20 anos de Guid! 07 de Dezembro de 2025",
                    images: [
                        {
                            url: `${baseUrl}/api/og?code=${code}`,
                            width: 1200,
                            height: 630,
                            alt: `Convite personalizado para ${guest.first_name}`,
                        },
                    ],
                    type: "website",
                },
                twitter: {
                    card: "summary_large_image",
                    title: `Convite para ${guest.first_name} ${guest.last_name || ''}`,
                    description: "Venha comemorar os 20 anos de Guid!",
                    images: [`${baseUrl}/api/og?code=${code}`],
                },
            };
        }
    } catch (error) {
        console.error("Error generating metadata:", error);
    }

    // Fallback metadata if guest not found
    return {
        title: "Convite - 20 anos da Guid",
        description: "Você está convidado para celebrar os 20 anos da Guid!",
    };
}

// Export the page component from the main file
export { default } from "./page";
