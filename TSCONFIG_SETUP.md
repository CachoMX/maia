# TypeScript Configuration for MAIA

## Required tsconfig.json Settings

To use the `@/` import alias in the authentication files, you need to configure your `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

## Key Settings

1. **Path Alias**: `"@/*": ["./*"]` - Allows importing from project root using `@/`
2. **Module Resolution**: `"moduleResolution": "bundler"` - For Next.js 14
3. **Strict Mode**: `"strict": true` - Enables all strict type checking

## Usage Examples

With this configuration, you can import like this:

```typescript
// Instead of relative paths:
import { createClient } from '../../../lib/supabase/client'

// Use absolute paths from root:
import { createClient } from '@/lib/supabase/client'
```

This makes imports cleaner and easier to refactor.
