# ! IMPORTANT: THis guide use a generic strategie to obtain the name from path url, but do a enhanced version for this, that link the custom url code to the guest name
### Guide: Dynamic Birthday OG Image Generator

To replicate the design you provided (placing the guest's name "Pérola" in the correct spot on the base image), we will use the `ImageResponse` API from `next/og`.

#### 1. Requirements & Setup
* **Next.js 13+** (App Router recommended).
* **Base Image:** Place your `og-image-base.jpg` file inside the `public` folder of your project.
* **Font:** The example uses a cursive script font. I will use **"Great Vibes"** from Google Fonts in the code below, as it closely matches the "Pérola" style.
* **Color:** I have matched the deep purple color from the text in your example (`#3e0e4c`).

#### 2. The Implementation Plan
We will create an API route (`app/api/og/route.tsx`). When this route is visited with a query parameter (e.g., `?name=Pérola`), it will:
1.  Load the specific cursive font.
2.  Load the base image.
3.  Render a layout combining the background image and the dynamic text centered in the specific "whitespace" area of your design.

#### 3. Coordinate Estimation
Based on your provided images:
* The "Venha comemorar" text is centered horizontally.
* There is a clear gap at the top for the name.
* I have set the name container to sit approximately **15% from the top** of the image to align perfectly with the gap.

Here are the files.


http://googleusercontent.com/immersive_entry_chip/0


http://googleusercontent.com/immersive_entry_chip/1

### Key Details for Tweaking

1.  **Placement (`marginTop: '130px'`):** I estimated the vertical gap based on your uploaded images. If the name is too high or too low, adjust this pixel value in the `route.tsx` file.
2.  **Font Size (`fontSize: 130`):** Script fonts often appear smaller than standard sans-serif fonts, so I used a large size (130px). Adjust this if names are too long or too short.
3.  **Color (`#4e1a57`):** This hex code is picked from the "Venha comemorar" text. You can darken or lighten it to ensure readability.

----

Next.js Dynamic OG Image Guide1. File PlacementEnsure your base image is accessible.Move your og-image-base.jpg into the public/ folder at the root of your project.2. UsageOnce the code below is implemented, you can generate an image by visiting:http://localhost:3000/api/og?name=Pérola3. Integration in PagesTo use this in your specific pages (e.g., a dynamic guest page), add the openGraph metadata to your page.tsx:// app/invite/[guestName]/page.tsx

export async function generateMetadata({ params }) {
  const { guestName } = params;
  
  // Encode the name to handle special characters (like é, ó, spaces)
  const encodedName = encodeURIComponent(guestName);
  
  return {
    title: `Convite para ${guestName}`,
    openGraph: {
      images: [
        {
          url: `/api/og?name=${encodedName}`,
          width: 1200,
          height: 630,
        },
      ],
    },
  };
}
