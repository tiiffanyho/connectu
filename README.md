# ConnectU

This repository contains two ways to preview the ConnectU welcome experience:

1. **Static welcome page** – open `public/index.html` directly in your browser (or with VS Code Live Server) to see the standalone hero screen without running a Node server.
2. **Full React Router app** – install dependencies and run the Vite dev server to explore the complete application.

## Prerequisites

- [Node.js](https://nodejs.org/) 18 or newer (includes npm)
- Optional: VS Code with the Live Server extension for auto-reloading when editing the static HTML file.

## Project structure

```
app/                    # React Router routes and components
public/index.html       # Standalone landing page + Vite entry HTML
vite.config.ts          # Vite configuration
react-router.config.ts  # React Router data dependencies
```

All project files now live at the repository root, so `package.json` is available directly in the clone directory.

## Installation & development

```bash
npm install
npm run dev
```

The development server runs at <http://localhost:5173>.

## Static HTML preview

To see the landing page without running the build tooling, open `public/index.html` in your browser. With VS Code Live Server, right-click the file and choose **Open with Live Server**.

## Production build

```bash
npm run build
```

The build output appears in `build/` and can be deployed with any Node-friendly host or via the provided `Dockerfile`.

## Implementing the React interface for ConnectU

To turn the design into an interactive React experience for university students, start from the Vite/React Router setup that already powers the `/app` directory:

1. **Define page structure in routes.** Use the files in `app/routes/` as entry points for each screen—for example `app/routes/home.tsx` currently renders the welcome experience and can evolve into the student dashboard shell. Organize additional routes (e.g., onboarding, groups, messaging) by creating sibling files and registering them in `app/routes.ts` if you need nested layouts.
2. **Compose UI components.** The shared `app/welcome/welcome.tsx` component shows how to assemble hero content and resource cards with Tailwind-style utility classes. Extract reusable building blocks (buttons, profile previews, group tiles) into new components under `app/` and import them into your routes to keep layouts consistent.
3. **Style with global assets.** Global fonts and document chrome are defined in `app/root.tsx`, which injects the Inter typeface and wraps every page in the React Router `<Layout>` component. Extend `app/app.css` to add design tokens such as colors for faculties, spacing scale, or dark mode tweaks that reflect your brand.
4. **Add data and interactivity.** Use loader/actions in React Router to fetch or mutate data for features like study groups or event RSVPs; colocate hooks alongside the route files so that network calls stay close to the UI they power. Local UI state (modal visibility, filter chips) can live inside components via `useState` and `useReducer`, while cross-cutting concerns (authenticated user, notifications) can be lifted into context providers mounted in `app/root.tsx`.
5. **Iterate with the dev server.** Run `npm run dev` to preview changes with hot reloading. The development server reflects updates instantly, making it easy to refine responsive breakpoints and accessibility (e.g., focus order, ARIA labels) as you adapt the design for real student workflows.

Following this flow lets you evolve the static design into a fully interactive social hub—introducing features like profile discovery, study group creation, and campus events while reusing the existing routing, styling, and build tooling.
