---
name: games-ui
description: Build and modify games.secona.dev React game interfaces using the repository's retro visual system, shared Base UI components, and accessible viewport-safe layouts.
---

# Games UI

Use this skill for UI work in the `games.secona.dev` repository: adding games, changing existing game screens, creating shared controls, or fixing layout and accessibility issues. Keep game rules and game state in the game feature; put repeated interaction and presentation patterns in `src/components`.

## Repository conventions

- The app is React 19 + TypeScript + Vite with TanStack Router.
- Shared components live directly in `src/components`. Keep a component's implementation and stylesheet together, for example `Button.tsx` + `Button.css`.
- Search before adding markup. Repeated JSX, CSS, or behavior should have one implementation and multiple imports.
- Prefer direct imports from the component file. Do not add a barrel file solely to re-export a few components.
- Keep reusable components generic through typed props. Do not move game-specific state, win/loss rules, or content into a shared primitive.
- Avoid defining reusable components inside another component.

Existing shared primitives include:

- `src/components/Button.tsx`: Base UI-backed button with the repository's visual variants.
- `src/components/Modal.tsx`: Base UI-backed dialog with shared game styling.
- `src/components/WindowButtons.tsx`: Decorative three-dot title-bar control.

Extend these primitives before creating another one-off equivalent.

## Base UI usage

`@base-ui/react` is the interaction foundation for shared controls. Import the smallest direct entry point:

```tsx
import { Button as BaseButton } from '@base-ui/react/button'
import { Dialog } from '@base-ui/react/dialog'
```

### Buttons

Use the shared `Button` for actions instead of raw `<button>` elements when the control matches an existing variant. The wrapper must:

- forward its ref;
- spread Base UI props to the underlying Base UI button;
- preserve native button behavior and `type="button"`/`type="submit"`;
- compose a shared base class with a small, explicit variant class;
- keep `disabled`, keyboard interaction, and ARIA props intact.

Use a styled `Link` for navigation. Do not render links as buttons; links have link semantics and should stay links.

For a new button treatment, prefer adding a named variant to `Button` when the treatment can be reused. Keep state classes such as `is-selected` or `is-answer` in the game feature when they represent game state rather than button behavior.

### Dialogs and modals

Use the shared `Modal` for game information, instructions, settings, and other modal content. Its Base UI anatomy is:

```tsx
<Dialog.Root>
  <Dialog.Trigger />
  <Dialog.Portal>
    <Dialog.Backdrop />
    <Dialog.Viewport>
      <Dialog.Popup>
        <Dialog.Title />
        <Dialog.Description />
        <Dialog.Close />
      </Dialog.Popup>
    </Dialog.Viewport>
  </Dialog.Portal>
</Dialog.Root>
```

Use uncontrolled state for a self-contained modal. Use `open` and `onOpenChange` only when surrounding game state needs to control it. Compose custom trigger and close visuals through Base UI's `render` prop, and make any custom component used there forward refs and received props.

Do not add a second document-level Escape listener, manual focus restoration, or hand-rolled focus trap. Base UI's modal dialog supplies focus handling, Escape dismissal, outside-pointer dismissal, scroll locking, and portal rendering. Always keep a visible `Dialog.Close` control inside the popup.

Portaled UI is above the app stacking context. Keep `#root { isolation: isolate; }` in place. Style a modal backdrop and viewport as fixed, full-screen layers; use the viewport for centering/scrolling and the popup for the visible panel. Do not nest the popup inside the backdrop when using the shared anatomy.

## Visual system

Use the existing tokens from `src/App.css`:

```css
--ink: #171717;
--paper: #f2f6fa;
--yellow: #f5c84b;
--red: #f16a5a;
--blue: #6f9fe8;
--line: 2px solid var(--ink);
--shadow: 6px 6px 0 var(--ink);
```

The intended direction is a crisp retro game interface:

- a cool blue-gray canvas, pale paper surface, near-black ink, and yellow/red/blue accents chosen to keep yellow and secondary states distinct for people with protanopia;
- 2px dark borders and hard offset shadows, not soft shadows;
- square or rectangular controls with little or no rounding;
- Space Mono for labels, statuses, progress, and controls;
- Impact/Arial Narrow-style uppercase display headings;
- uppercase labels with modest letter spacing;
- short, quick transforms for hover/active feedback.

Prefer existing tokens and selectors over new near-duplicate colors. Avoid gradients, glass effects, excessive radii, and generic UI-library styling unless the request explicitly calls for them.

Do not pair green with yellow to communicate different states. The product owner has protanopia, so use the established blue accent for states that need to contrast with yellow, retain non-color cues where available, and do not rely on color alone to communicate meaning.

Global layout invariants:

```css
body {
  margin: 0;
}

#root {
  min-height: 100svh;
  isolation: isolate;
}

.page-shell {
  width: min(1120px, calc(100% - 32px));
  min-height: calc(100svh - 32px);
  margin: 16px auto;
  box-sizing: border-box;
}
```

At narrow widths the shell becomes `calc(100% - 20px)` with 10px margins. Keep `box-sizing: border-box` for layout containers and controls.

For vertical spacing, use viewport-height-aware values such as `vh`/`svh` and `clamp()`. Do not use a wide-screen `vw` value for vertical padding when it can make a full-screen game taller than the viewport. A `min-height` is not a guarantee that children plus padding fit; calculate the header, content, padding, margins, and borders together.

Let short viewports scroll only when the content genuinely cannot fit. For screens where the game fits, the page shell should not gain an accidental scrollbar from margins, padding, borders, or shadows. Check both a tall desktop viewport and a common 1280×720 viewport after layout changes.

Respect reduced motion:

```css
@media (prefers-reduced-motion: reduce) {
  .interactive-control {
    transition: none;
  }
}
```

## Change workflow

1. Use `rg` to locate existing components, duplicate markup, related classes, and all callers before editing.
2. Reuse or extend a component in `src/components` when the behavior or visual treatment will serve more than one game.
3. Keep feature-specific CSS in the game folder and shared component CSS with the shared component.
4. Preserve semantic HTML: use buttons for actions, links for navigation, headings for titles, and live regions only for changing status.
5. For dialogs, test mouse, keyboard trigger, Tab navigation, Escape, visible close, outside click, and focus restoration.
6. Run the repository checks:

```bash
pnpm lint
pnpm build
git diff --check
```

7. Visually check the affected route at desktop and narrow viewport sizes. Confirm there are no duplicate controls, unexpected page scrollbars, clipped content, or broken focus outlines.
