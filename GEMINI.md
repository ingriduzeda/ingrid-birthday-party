# GEMINI Code Companion Documentation

This document provides a comprehensive overview of the **Ingrid's Birthday Party** project, designed to be understood by both human developers and AI assistants.

## Project Overview

This is a web application for Ingrid's 20th birthday party. It serves as a digital invitation, providing guests with event details, a map to the location, and an RSVP form. The application is designed to be a single-page experience with a "gatekeeper" to ensure only invited guests can view the content.

The project is built with a modern tech stack, featuring a Next.js frontend and a PocketBase backend for managing guest data.

## Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) 16 (with React 19)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) with `shadcn/ui` for components
- **Animations:** [Framer Motion](https://www.framer.com/motion/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Backend:** [PocketBase](https://pocketbase.io/)
- **Linting:** [ESLint](https://eslint.org/)
- **Package Manager:** [npm](https://www.npmjs.com/)

## Project Structure

The project follows the standard Next.js App Router structure.

- **`app/`**: Contains the main application logic and routing.
  - **`app/page.tsx`**: The main entry point of the application, which renders the single-page invitation.
  - **`app/layout.tsx`**: The root layout of the application, which includes the custom fonts and metadata.
  - **`app/admin/`**: Contains the admin dashboard for managing guests and settings.
- **`components/`**: Contains the reusable React components used throughout the application.
  - **`components/ui/`**: Contains the `shadcn/ui` components.
- **`lib/`**: Contains the library code, including the PocketBase client.
  - **`lib/pocketbase.ts`**: Initializes the PocketBase client and defines the database schema.
- **`public/`**: Contains the static assets, such as images and icons.
- **`scripts/`**: Contains the scripts for managing the PocketBase database schema.

## Backend Integration (PocketBase)

The application uses a self-hosted PocketBase instance for its backend, located at `https://party-pocketbase.ingriduzeda.com`. The `lib/pocketbase.ts` file configures the client and defines the TypeScript types for the database collections.

### Collections

- **`guests`**: Stores the guest information, including their name, confirmation status, number of companions, and a message.
- **`config`**: Stores the application configuration, such as feature flags.

### Scripts

The `scripts/` directory contains Node.js scripts for managing the PocketBase database:

- **`setup-pocketbase.mjs`**: Sets up the initial database schema.
- **`verify_pb_schema.mjs`**: Verifies that the database schema is up-to-date.
- **`fix_pb_schema.mjs`**: Applies any necessary fixes to the database schema.
- **`debug_pb.mjs`**: A debugging script for interacting with the PocketBase instance.

## Getting Started

To run the project locally, follow these steps:

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run the development server:**
   ```bash
   npm run dev
   ```

3. **Open the application:**
   Open [http://localhost:3000](http://localhost:3000) in your browser.

To interact with the PocketBase instance, you can use the scripts in the `scripts/` directory. For example, to set up the database schema, run:

```bash
node scripts/setup-pocketbase.mjs
```
