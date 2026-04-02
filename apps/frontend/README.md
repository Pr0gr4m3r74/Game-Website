# Frontend Application

Modern React + TypeScript frontend for the Game Website platform.

## Features

- ⚡ **Vite** - Lightning fast build tool
- ⚛️ **React 18** - Modern React with hooks
- 🔷 **TypeScript** - Type safety and better DX
- 🎨 **Tailwind CSS** - Utility-first styling
- 🌐 **i18next** - Internationalization (EN/DE)
- 🎮 **Three.js** - 3D avatar rendering
- 📱 **PWA** - Progressive Web App support
- 🔐 **JWT Auth** - Token-based authentication
- 🛣️ **React Router** - Client-side routing

## Getting Started

### Prerequisites

- Node.js 18+
- npm or pnpm

### Installation

```bash
cd apps/frontend
npm install
```

### Development

```bash
npm run dev
```

The app will be available at `http://localhost:3000`

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Environment Variables

Create a `.env` file based on `.env.example`:

```env
VITE_API_URL=http://localhost:4000
VITE_WS_URL=ws://localhost:4000
VITE_APP_NAME=Game Website
```

## Project Structure

```
src/
├── api/              # API client and endpoints
├── components/       # Reusable React components
├── hooks/            # Custom React hooks
├── i18n/             # Internationalization
│   └── locales/      # Translation files
├── pages/            # Route pages
├── store/            # State management
├── three/            # Three.js 3D components
├── types/            # TypeScript types
├── utils/            # Utility functions
├── App.tsx           # Main app component
├── main.tsx          # Entry point
└── index.css         # Global styles
```

## Routes

- `/` - Home page
- `/login` - Login page
- `/register` - Registration page
- `/avatar-editor` - Avatar customization (protected)
- `/cosmetics` - Cosmetics store (protected)
- `/marketplace` - Marketplace (protected)
- `/worlds` - Virtual worlds (protected)
- `/admin` - Admin dashboard (protected)

## PWA Icons

Place PWA icons in `public/icons/`:
- `icon-192x192.png` (192x192 px)
- `icon-512x512.png` (512x512 px)

See `public/icons/README.md` for more details.

## Technologies

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite 5** - Build tool
- **Tailwind CSS** - Styling
- **React Router** - Routing
- **i18next** - Internationalization
- **Axios** - HTTP client
- **Three.js** - 3D graphics
- **@react-three/fiber** - React renderer for Three.js
- **@react-three/drei** - Three.js helpers
- **vite-plugin-pwa** - PWA support

## License

MIT
