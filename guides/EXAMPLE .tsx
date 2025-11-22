import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);

        // 1. Get the name from the URL, default to 'Convidado' if missing
        // Example usage: /api/og?name=Pérola
        const name = searchParams.get('name')?.slice(0, 100) || 'Convidado';

        // 2. Load the Cursive Font (Great Vibes)
        // We fetch it directly from Google Fonts to ensure it works in the Edge runtime.
        const fontData = await fetch(
            new URL('https://fonts.gstatic.com/s/greatvibes/v14/RWmMoKWR9v4ksMflq1L1x92dAH9h0Q.ttf', import.meta.url)
        ).then((res) => res.arrayBuffer());

        // 3. Load the Base Image
        // In production, use your actual domain. In local dev, we construct the URL.
        // NOTE: Ensure 'og-image-base.jpg' is in your 'public' folder.
        const protocol = request.headers.get('x-forwarded-proto') || 'http';
        const host = request.headers.get('host');
        const imageUrl = `${protocol}://${host}/og-image-base.jpg`;

        return new ImageResponse(
            (
                <div
                    style={{
                        display: 'flex',
                        height: '100%',
                        width: '100%',
                        alignItems: 'flex-start', // Use flex-start to control vertical position manually
                        justifyContent: 'center',
                        flexDirection: 'column',
                        backgroundImage: `url(${imageUrl})`,
                        backgroundSize: '100% 100%',
                        backgroundPosition: 'center',
                    }}
                >
                    {/* Container for the Name 
            - We use absolute positioning or margins to place it exactly in the whitespace 
            above "Venha comemorar".
          */}
                    <div
                        style={{
                            display: 'flex',
                            width: '100%',
                            justifyContent: 'center',
                            // "mt" (margin-top) controls the vertical position. 
                            // Based on the image, the gap is roughly 120px-180px from the top.
                            marginTop: '130px',
                        }}
                    >
                        <span
                            style={{
                                fontFamily: '"Great Vibes"',
                                fontSize: 130, // Large size for the script font
                                color: '#4e1a57', // Deep purple matching the "Venha comemorar" text
                                textAlign: 'center',
                                lineHeight: 1,
                                textShadow: '2px 2px 4px rgba(255, 255, 255, 0.5)', // Subtle shadow to pop against paper texture
                                padding: '0 20px', // Prevent text from hitting edges
                            }}
                        >
                            {name}
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
            },
        );
    } catch (e: any) {
        console.log(`${e.message}`);
        return new Response(`Failed to generate the image`, {
            status: 500,
        });
    }
}