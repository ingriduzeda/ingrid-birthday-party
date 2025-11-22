import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';
import pb from '@/lib/pocketbase';
import { readFile } from 'fs/promises';
import { join } from 'path';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);

        // Get the invite code from URL parameter
        const code = searchParams.get('code');

        // If no code is provided, redirect to static card image
        if (!code) {
            const protocol = request.headers.get('x-forwarded-proto') || 'http';
            const host = request.headers.get('host');
            const fallbackUrl = `${protocol}://${host}/seo/og-image-card.png`;

            return Response.redirect(fallbackUrl, 302);
        }

        let guestName = null;

        // Fetch the guest's first name from database
        try {
            const records = await pb.collection('guests').getList(1, 1, {
                filter: `invite_code = "${code}"`
            });

            if (records.items.length > 0) {
                guestName = records.items[0].first_name;
            }
        } catch (error) {
            console.error('Error fetching guest for OG image:', error);
        }

        // If guest not found, redirect to static card image
        if (!guestName) {
            const protocol = request.headers.get('x-forwarded-proto') || 'http';
            const host = request.headers.get('host');
            const fallbackUrl = `${protocol}://${host}/seo/og-image-card.png`;

            return Response.redirect(fallbackUrl, 302);
        }

        // Generate personalized image for valid guests
        // Load the cursive font (Great Vibes) from Google Fonts
        const fontData = await fetch(
            new URL('https://fonts.gstatic.com/s/greatvibes/v14/RWmMoKWR9v4ksMflq1L1x92dAH9h0Q.ttf', import.meta.url)
        ).then((res) => res.arrayBuffer());

        // Load the base image
        const protocol = request.headers.get('x-forwarded-proto') || 'http';
        const host = request.headers.get('host');
        const imageUrl = `${protocol}://${host}/seo/og-image-base.png`;

        return new ImageResponse(
            (
                <div
                    style={{
                        display: 'flex',
                        height: '100%',
                        width: '100%',
                        alignItems: 'flex-start',
                        justifyContent: 'center',
                        flexDirection: 'column',
                        backgroundImage: `url(${imageUrl})`,
                        backgroundSize: '100% 100%',
                        backgroundPosition: 'center',
                    }}
                >
                    {/* Container for the guest's name */}
                    <div
                        style={{
                            display: 'flex',
                            width: '100%',
                            justifyContent: 'center',
                            marginTop: '130px',
                        }}
                    >
                        <span
                            style={{
                                fontFamily: '"Great Vibes"',
                                fontSize: 130,
                                color: '#4e1a57',
                                textAlign: 'center',
                                lineHeight: 1,
                                textShadow: '2px 2px 4px rgba(255, 255, 255, 0.5)',
                                padding: '0 20px',
                            }}
                        >
                            {guestName}
                        </span>
                    </div>
                </div>
            ),
            {
                width: 1200,
                height: 630,
                fonts: [
                    {
                        name: 'Great Vibes',
                        data: fontData,
                        style: 'normal',
                    },
                ],
            }
        );
    } catch (e: any) {
        console.error(`Error generating OG image: ${e.message}`);

        // Fallback to static card image on error
        try {
            const protocol = request.headers.get('x-forwarded-proto') || 'http';
            const host = request.headers.get('host');
            const fallbackUrl = `${protocol}://${host}/seo/og-image-card.png`;

            return Response.redirect(fallbackUrl, 302);
        } catch {
            return new Response(`Failed to generate the image`, {
                status: 500,
            });
        }
    }
}
