# Project Structure

## Architecture Overview

The application follows a **page-based architecture** with centralized state management through React Context. The main flow progresses through: Home → Search Results → Deep Dive Analysis → Chat Interface.

## Folder Organization

### Core Application Files
- `App.tsx` - Main application component with routing logic
- `index.tsx` - Application entry point
- `types.ts` - Global TypeScript type definitions
- `config.ts` - Application configuration (demo mode, etc.)

### Component Structure
```
components/
├── chat/           # Chat-specific components
├── common/         # Reusable UI components (Button, Card, etc.)
├── deepdive/       # Deep dive analysis components
├── icons/          # SVG icon components
├── search/         # Search and results components
└── ui/             # UI-specific components (modals, panels)
```

### Application Layers
```
pages/              # Top-level page components
├── HomePage.tsx
├── ResultsPage.tsx
├── DeepDivePage.tsx
└── ChatPage.tsx

contexts/           # React Context providers
└── AppContext.tsx  # Central state management

hooks/              # Custom React hooks
├── useAppShell.ts  # App-level state and navigation
├── useSearch.ts    # Search functionality
├── useDeepDive.ts  # Deep dive analysis
└── useChat.ts      # Chat interface logic

services/           # External API integration
├── gemini/         # Gemini AI service modules
├── geminiService.ts # Service exports
├── prompts.ts      # AI prompt templates
├── zodSchemas.ts   # Data validation schemas
└── mockData.ts     # Demo/test data
```

## Key Patterns

### State Management
- **Context-based**: Single `AppContext` provides global state
- **Hook-based**: Each major feature has dedicated custom hook
- **Immutable updates**: State changes follow React best practices

### Component Organization
- **Feature-based folders**: Components grouped by functionality
- **Atomic design**: Common components in `common/` folder
- **Icon library**: Centralized SVG components in `icons/`

### Service Layer
- **Modular AI services**: Separate files for each AI operation type
- **Schema validation**: Zod schemas ensure type safety for API responses
- **Mock data support**: Toggle between live API and demo data

### File Naming Conventions
- **PascalCase**: React components (`HomePage.tsx`)
- **camelCase**: Hooks, services, utilities (`useSearch.ts`)
- **kebab-case**: Configuration files when needed