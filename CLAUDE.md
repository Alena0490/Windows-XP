# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Browser-based recreation of the Windows XP desktop (Luna theme). Started as a Minesweeper clone and grew into a full XP shell with multiple working applications: Minesweeper, Paint, Internet Explorer 6 (iframe-based), Calculator, Terminal, Notepad, and a File Manager. Live at https://alena0490.github.io/Windows-XP/.

The actual app lives in the `minesweeper/` subfolder — `package.json`, `src/`, `vite.config.ts` etc. are all there. The repo root contains assets and reference material (icons, fonts, the 1997 minesweeper paper PDF).

## Commands

Run from `minesweeper/`:

```bash
npm run dev       # Vite dev server
npm run build     # tsc -b && vite build (TypeScript project references must pass before bundling)
npm run lint      # ESLint over .ts/.tsx
npm run preview   # Preview the production build
npm run deploy    # Build + publish dist/ to gh-pages (predeploy runs build automatically)
```

No test runner is configured — there is no `npm test`.

Vite's `base` is `/Windows-XP/` (set in `vite.config.ts`) because the production build is served from a GitHub Pages subpath. Asset URLs and `import.meta.env.BASE_URL` resolve against this; keep this in mind when adding routes or absolute paths.

## Architecture

### Window/desktop shell — `src/App.tsx`

`App.tsx` is the root and owns essentially all top-level state. It's the single source of truth for which apps are open, which is focused, and the boot/shutdown lifecycle. Each app is rendered as a top-level child of the desktop, not nested in a window manager component.

Key state shape, repeated per app:
- `is<App>Open` boolean — whether the window exists at all (mount/unmount)
- A `useWindowState()` instance (`hooks/useWindowState.ts`) — owns `isMinimized` and `isFullscreen`
- A `handle<App>Minimize` wrapper that plays the correct sound (`playMinimize` going down, `playStart` coming back up) before delegating to the hook's setter
- An `open<App>()` helper that opens-or-restores-and-focuses

**Z-ordering** is a `windowOrder: WindowId[]` array. `bringToFront(id)` moves the id to the end; `windowOrder.map(renderWindow)` produces the DOM in stacking order. Every app's outer container calls `onMouseDown={() => bringToFront(id)}` to focus on click. When adding a new window, you must (1) add a `WindowId` literal, (2) add `useWindowState`, open-flag, and minimize-handler, (3) add a branch to `renderWindow`, (4) wire desktop-icon / Footer / `handleOpenApp` entry points, and (5) register it as a `manualChunks` entry in `vite.config.ts`.

**Boot/shutdown flow** is also in `App.tsx`: `LoginScreen` → `LoadingScreen` (XPLoading) → desktop. `ShutdownScreen` is overlaid for log-off / turn-off, then `handleShutdownAction` triggers a 3-second `fadeToBlack` overlay before either dropping back to the login screen or restarting (which re-shows the loading screen). The login screen also serves as the gate for browser autoplay restrictions — sounds played before the first user interaction will be blocked.

### Per-app structure

Each app lives under `src/components/<AppName>/` and conventionally splits into:
- `<App>.tsx` — chrome (title bar, dragging, minimize/close/fullscreen, menu bar)
- `<App>App.tsx` — the inner application content
- `<App>Menu.tsx` — the File/Edit/View menu bar

The chrome receives `onClose`, `isMinimized`, `setIsMinimized`, `isFullscreen`, fullscreen-toggle, and `onMouseDown` from `App.tsx`. **Do not invent a new prop shape** — match the existing apps so `App.tsx`'s wiring continues to work.

The Footer (taskbar + Start Menu) gets separate `is<App>Open`, `<app>Minimized`, `setMinimized`, and `on<App>Open` props for every app. Adding an app means threading props through `Footer.tsx` as well — there is no central registry.

### Hooks (`src/hooks/`)

- `useWindowState` — minimize/fullscreen state for one window
- `useDraggable` / `useDraggableDialog` — pointer-driven drag for windows and modal dialogs
- `useSound` — wraps the WAV/MP3 imports from `src/sounds/` and gates them on a per-hook `enabled` flag. **Each call to `useSound()` creates an independent `enabled` state** — the Minesweeper sound toggle does not affect the rest of the desktop. If you need a global mute, this is where to refactor.
- Paint splits its complexity across several hooks: `usePaintHistory` (undo/redo), `usePaintSelection`, `usePaintShapeDrawing`, `usePaintPanning`, `usePaintFileActions`. Read these before editing Paint internals — `Paint.tsx` orchestrates them rather than owning the logic.
- `useCalculatorLogic` similarly owns Calculator's full standard+scientific state machine.

### Minesweeper specifics

- Board model: `data/game.ts` defines `CellData`, `BoardConfig`, and the three classic difficulties (`beginnerConfig`, `intermediateConfig`, `expertConfig`).
- `utils/generateMines.ts` places mines after the first click and excludes the clicked cell + neighbours (safe-first-click guarantee).
- `utils/floodFill.ts` reveals the connected empty region.
- Best times persist to `localStorage` per difficulty.
- Timer caps at 999.

### Bundling

`vite.config.ts` defines a `manualChunks` map that emits one chunk per app (minesweeper, ie, paint, calculator, terminal, notepad, login, loading, footer, startmenu, errorbubble, criticalerror, shutdownscreen, shutdowndisplay, filemanager). When you add a new top-level app component, add it here too or it will be inlined into the main chunk.

### Styling

Pure CSS, no UI framework. XP Luna colours and bevel utilities are defined as CSS custom properties in `App.css` / `index.css` and reused across components. Each component ships its own sibling `.css` file. Custom XP scrollbars and font assets (`tahoma.ttf`, `digital.ttf`) are part of the look — don't replace them with system defaults.

### Assets

Images under `src/img/` (`.webp`), sounds under `src/sounds/` (`.wav`/`.mp3`). Both are imported as ES modules so Vite fingerprints and code-splits them. The repo root also contains source icon packs (`ICON/`, `Icons2/`, `Windows XP High Resolution Icon Pack/`) — these are not bundled; treat them as a reference library.
