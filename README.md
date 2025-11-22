# 🎉 Ingrid's 20th Birthday Party

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-16.0.3-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19.2.0-blue?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8?style=for-the-badge&logo=tailwind-css)
![PocketBase](https://img.shields.io/badge/PocketBase-0.26.3-b8dbe4?style=for-the-badge)

A beautiful, interactive digital invitation for Ingrid's 20th birthday celebration.

[Live Demo](#) · [Report Bug](#) · [Request Feature](#)

</div>

---

## 📖 About The Project

This is a premium web application designed as a digital invitation for Ingrid's 20th birthday party. It features a stunning "Blooming Journey" theme with interactive animations, a password-protected gatekeeper, RSVP functionality, and a comprehensive admin panel for managing guests.

### ✨ Key Features

- 🔐 **Password-Protected Entry** - Gatekeeper component ensures only invited guests can access
- 🎨 **Beautiful Animations** - Parallax effects, floating petals, and smooth transitions using Framer Motion
- 📝 **RSVP System** - Conversational multi-step form with real-time validation
- 🗺️ **Interactive Map** - Embedded Google Maps with exact location
- 📅 **Calendar Integration** - One-click add to Google Calendar
- 👨‍💼 **Admin Dashboard** - Complete guest management system with statistics
- 💬 **Guest Messages Wall** - Animated footer with scrolling messages
- 📱 **Fully Responsive** - Optimized for mobile, tablet, and desktop

---

## 🛠️ Tech Stack

### Frontend
- **[Next.js 16](https://nextjs.org/)** - React framework with App Router
- **[React 19](https://react.dev/)** - Latest React version with concurrent features
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe development
- **[Tailwind CSS 4](https://tailwindcss.com/)** - Utility-first CSS framework
- **[Framer Motion](https://www.framer.com/motion/)** - Production-ready animations
- **[shadcn/ui](https://ui.shadcn.com/)** - High-quality React components
- **[Lucide Icons](https://lucide.dev/)** - Beautiful icon library
- **[Canvas Confetti](https://www.kirilv.com/canvas-confetti/)** - Celebration effects

### Backend
- **[PocketBase](https://pocketbase.io/)** - Self-hosted backend with real-time database
- **Remote Instance**: `https://party-pocketbase.ingriduzeda.com`

### Development Tools
- **[ESLint](https://eslint.org/)** - Code linting
- **[React Hook Form](https://react-hook-form.com/)** - Form management
- **[Zod](https://zod.dev/)** - Schema validation
- **[date-fns](https://date-fns.org/)** - Date utilities

---

## 📁 Project Structure

```
ingrid-birthday-party/
├── app/                      # Next.js App Router
│   ├── page.tsx             # Main landing page
│   ├── layout.tsx           # Root layout with fonts
│   └── admin/               # Admin panel routes
│       ├── page.tsx         # Dashboard
│       ├── login/           # Admin login
│       ├── guests/          # Guest management
│       └── settings/        # Configuration
├── components/              # React components
│   ├── Gatekeeper.tsx      # Password entry
│   ├── Hero.tsx            # Hero section with parallax
│   ├── Invite.tsx          # Event details
│   ├── Map.tsx             # Google Maps integration
│   ├── RSVP.tsx            # RSVP form
│   ├── Footer.tsx          # Animated messages wall
│   ├── MobileNav.tsx       # Mobile navigation
│   └── ui/                 # shadcn/ui components
├── lib/                     # Library code
│   ├── pocketbase.ts       # PocketBase client config
│   └── utils.ts            # Utility functions
├── public/                  # Static assets
│   └── images/             # Gallery images
├── scripts/                 # Database scripts
│   ├── setup-pocketbase.mjs
│   ├── verify_pb_schema.mjs
│   ├── fix_pb_schema_correct.mjs
│   └── debug_pb.mjs
└── GEMINI.md               # AI assistant documentation
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 20+ and npm
- Access to PocketBase instance

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ingrid-birthday-party
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure PocketBase** (if needed)
   
   The app connects to the remote PocketBase instance at `https://party-pocketbase.ingriduzeda.com`. To set up the database schema:
   ```bash
   node scripts/fix_pb_schema_correct.mjs
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open the application**
   
   Navigate to [http://localhost:3000](http://localhost:3000) in your browser.

### Default Access

- **Portal Password**: `guid20` (configurable via Admin Settings)
- **Admin Password**: `admin2025` (configurable via Admin Settings)

---

## 🎨 Features Overview

### 🔐 Gatekeeper
Password-protected entry screen with dynamic password fetching from PocketBase. Features beautiful animations and confetti effect on successful unlock.

### 🎊 Hero Section
Stunning parallax section with "20 Anos" typography, floating petals, and smooth scroll effects.

### 💌 Invite Section
Event details displayed in a beautiful ticket-style card:
- **Date**: December 7, 2025
- **Time**: 18:00h
- **Location**: Rua Raul Leite, 1470, Condomínio Villa Privilege - Vila Laura, Salvador - BA
- **Calendar**: One-click add to Google Calendar

### 🗺️ Interactive Map
Embedded Google Maps with:
- Correct marker at Condo Villa Privilege
- Hover effects (grayscale to color)
- Direct "Abrir no Maps" button

### 📝 RSVP Form
Multi-step conversational form:
1. Guest name
2. Confirmation status
3. Number of companions
4. Personal message
- Real-time validation with Zod
- Confetti animation on submission
- Data stored in PocketBase

### 👨‍💼 Admin Panel

**Dashboard** (`/admin`)
- Total guests count
- Confirmed vs. pending statistics
- Recent RSVPs list
- Quick actions

**Guest List** (`/admin/guests`)
- Searchable table with all guest data
- Confirmation status badges
- Delete functionality
- Import multiple guests at once

**Settings** (`/admin/settings`)
- Toggle RSVP form on/off
- Update portal password
- Update admin password

### 💬 Animated Footer
Beautiful gradient footer featuring:
- Infinite scrolling guest messages
- Floating petal animations
- Hover effects on message cards
- Auto-refresh every 30 seconds

---

## 📦 PocketBase Collections

### `guests`
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | text | Yes | Guest name |
| `is_confirmed` | bool | No | Confirmation status |
| `companions_count` | number | No | Number of companions |
| `message` | text | No | Personal message |

### `config`
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `key` | text | Yes | Configuration key (unique) |
| `value` | json | Yes | Configuration value |

**Default Config Records:**
- `rsvp_enabled`: `true`
- `portal_password`: `guid20`
- `admin_password`: `admin2025`

---

## 🛠️ Scripts

### Database Management

```bash
# Setup initial schema
node scripts/setup-pocketbase.mjs

# Verify schema integrity
node scripts/verify_pb_schema.mjs

# Fix schema issues
node scripts/fix_pb_schema_correct.mjs

# Debug PocketBase connection
node scripts/debug_pb.mjs
```

### Development

```bash
# Run dev server with Turbopack
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

---

## 🎯 Environment Variables

The PocketBase URL is configured directly in `lib/pocketbase.ts`:
```typescript
const pb = new PocketBase('https://party-pocketbase.ingriduzeda.com');
```

To use a different instance, update this value.

---

## 🎨 Design Theme

**Color Palette:**
- Primary: Fuchsia (`#d946ef`)
- Secondary: Purple (`#a855f7`)
- Accent: Pink (`#ec4899`)
- Background: White with fuchsia tints

**Typography:**
- Heading Font: Great Vibes (script)
- Body Font: Inter (sans-serif)

**Animation Style:**
- Smooth parallax scrolling
- Floating petal decorations
- Fade-in effects with Framer Motion
- Hover transformations

---

## 📱 Responsive Design

The application is fully responsive with breakpoints:
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

Mobile-specific features:
- Sticky bottom navigation
- Touch-optimized interactions
- Simplified layouts

---

## 🔒 Security

- Passwords stored in PocketBase backend
- Dynamic password fetching (not hardcoded)
- Admin cookie-based authentication
- Client-side password validation

---

## 🚢 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import repository to Vercel
3. Deploy automatically

### Other Platforms

The app can be deployed to any platform supporting Next.js:
- Netlify
- Railway
- AWS Amplify
- DigitalOcean App Platform

---

## 📝 License

This project is private and created for Ingrid's birthday celebration.

---

## 🙏 Acknowledgments

- Design inspiration from modern event invitation trends
- PocketBase for the excellent backend solution
- Vercel for Next.js and hosting platform
- All contributors and well-wishers

---

<div align="center">

**Made with ❤️ for Ingrid**

</div>
