# Repository Guidelines

## Project Structure & Module Organization

- `src/games/<game>/` contains each game’s React component and feature CSS.
- `src/components/` contains reusable UI primitives such as `Button`, `Modal`, and `WindowButtons`; keep component styles beside their implementation.
- `src/pages/` contains page-level views, while `src/routes/` defines TanStack Router routes.
- `src/App.tsx`, `src/App.css`, and `src/index.css` provide application bootstrapping, shared layout, and global styles.
- `public/` contains static assets such as the favicon. There is currently no automated test directory.

## Build, Test, and Development Commands

Use pnpm:

```bash
pnpm install     # Install dependencies
pnpm dev         # Start the Vite development server
pnpm lint        # Run Oxlint
pnpm build       # Type-check and create a production Vite build
pnpm preview     # Serve the production build locally
```

There is no test framework or `test` script configured yet. For UI changes, run `pnpm lint` and `pnpm build`, then manually exercise the affected route.

## Coding Style & Naming Conventions

Use two-space indentation, single quotes, no semicolons, and trailing commas where the existing TypeScript style uses them. Name React components and component files in PascalCase; use descriptive camelCase variables and handlers. Prefer direct imports and typed props. Use Base UI primitives through shared wrappers in `src/components` rather than duplicating buttons, dialogs, or focus behavior.

Keep the visual system consistent: reuse the CSS tokens in `src/App.css`, use the established cool blue-gray canvas and pale paper surface instead of beige backgrounds, use crisp 2px borders and hard offset shadows, Space Mono for UI labels, and Impact-style uppercase display headings. Use `100svh`/`vh`-aware layout values and avoid width-based vertical padding that can introduce page scrollbars. Design color states for protanopia: do not use green and yellow as a meaningful pair; prefer the established blue accent when a state must contrast with yellow, and never rely on color alone to communicate state.

## Testing Guidelines

Until automated tests are added, verify keyboard interaction, visible focus states, modal Escape/outside-click behavior, responsive layout, and absence of unintended overflow. Check desktop and 1280×720 viewports when changing full-screen layouts.
