# Technology Stack

## Core Technologies

- **Frontend**: React 19.1.0 with TypeScript
- **Build System**: Vite 6.2.0
- **AI Integration**: Google Gemini AI (@google/genai)
- **Validation**: Zod for schema validation
- **Styling**: Tailwind CSS (inferred from component structure)

## Project Configuration

- **Module System**: ES Modules (`"type": "module"`)
- **TypeScript**: Strict mode enabled with experimental decorators
- **Path Aliases**: `@/*` maps to project root
- **Environment**: API keys managed via `.env.local`

## Common Commands

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production  
npm run preview      # Preview production build

# Setup
npm install          # Install dependencies
```

## Environment Setup

1. Create `.env.local` file
2. Set `GEMINI_API_KEY` to your Google Gemini API key
3. Configure `USE_DEMO_DATA` in `config.ts` (true for mock data, false for live API)

## Key Dependencies

- **@google/genai**: Gemini AI client for all AI operations
- **zod**: Runtime type validation for API responses
- **react/react-dom**: UI framework

## Build Configuration

- Vite handles bundling and development server
- Environment variables exposed via `process.env.GEMINI_API_KEY`
- Path resolution configured for `@/` imports