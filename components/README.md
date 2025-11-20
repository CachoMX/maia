# Components Directory

This directory contains all React components for the Maia application.

## Structure

- **ui/** - Reusable UI components from shadcn/ui
- **cases/** - Case management components
- **interventions/** - Intervention tracking components
- **meetings/** - Parent meeting scheduling components
- **analytics/** - Analytics and dashboard widgets
- **dashboard/** - Dashboard layout components

## Guidelines

- All components should be TypeScript (.tsx)
- Use the `cn()` utility from `@/lib/utils` for className merging
- Follow Maia brand colors from tailwind.config.ts
- Components should be functional and use React hooks
