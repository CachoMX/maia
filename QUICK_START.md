# Maia - Quick Start Guide

## Get Started in 3 Steps

### 1. Set Up Environment Variables

Copy the example file and add your credentials:

```bash
cp .env.example .env.local
```

Edit `.env.local` and add:
- Supabase URL and keys
- Anthropic API key
- Google OAuth credentials

### 2. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Start Building

**Key Directories:**
- `app/` - Pages and routes
- `components/` - React components
- `lib/` - Utilities and integrations
- `types/` - TypeScript types

## Common Commands

```bash
# Development
npm run dev          # Start dev server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Check TypeScript

# Package Management
npm install          # Install dependencies
npm audit            # Check for vulnerabilities
npm audit fix        # Fix vulnerabilities
```

## Project Structure

```
maia/
├── app/              # Next.js App Router
│   ├── layout.tsx   # Root layout
│   ├── page.tsx     # Homepage
│   └── auth/        # Authentication
├── components/      # React components
│   ├── ui/         # shadcn/ui components
│   ├── cases/      # Case management
│   └── ...
├── lib/            # Utilities
│   ├── auth/       # Authentication
│   ├── supabase/   # Supabase client
│   └── utils/      # Helpers
└── types/          # TypeScript types
```

## Maia Brand Colors

Use these Tailwind classes in your components:

- `text-star-gold` / `bg-star-gold` - Gold (#FFD700)
- `text-ocean-blue` / `bg-ocean-blue` - Blue (#0066CC)
- `text-light-blue` / `bg-light-blue` - Light Blue (#E6F2FF)
- `text-maia-green` / `bg-maia-green` - Green (#00AA33)

## Need Help?

- See `PROJECT_INITIALIZATION_SUMMARY.md` for full details
- See `MAIA_BRANDING.md` for branding guidelines
- See `MAIA_MVP_PRIORITY_FEATURES.md` for feature roadmap
- See `MAIA_AGENT_ARCHITECTURE.md` for agent workflow

## Status

✅ Project initialized and ready for development
🚀 Ready for Week 1 tasks (Database, Auth, Components)

*Maia - Illuminating Pathways to Student Success*
