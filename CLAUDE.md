# CLAUDE.md

Official guidance for Claude Code when working with this Windows XP desktop recreation.

## Project Overview

Browser-based Windows XP (Luna theme) shell with fully functional applications. Started as Minesweeper, evolved into a complete desktop environment. Live at https://alena0490.github.io/Windows-XP/

**Structure:** App lives in `minesweeper/` subfolder (`package.json`, `src/`, `vite.config.ts`). Repo root contains reference assets only.

## Critical Rules for Development

### Model Selection
**ALWAYS use `claude-haiku-4-5` for all development work.** Explicitly verify in conversation or set via CLI.

### Token Efficiency (REQUIRED)
1. **Exact file paths required** — never use `src/components/Notepad.tsx`, always use full path: `C:\Users\alena\Downloads\Coding (1)\Coding\Minesweeper\minesweeper\src\components\notepad\Notepad.tsx`
2. **No exploratory work** — if you don't know the exact location, ask the user or use Glob with the precise pattern
3. **Minimal edits only** — use Edit tool for changes, never rewrite files unless explicitly requested
4. **No unnecessary checks** — do not run `tsc`, `eslint`, or build unless asked
5. **Read once, edit once** — if you read a file, make all planned changes in a single Edit call; don't re-read to verify
6. **Cache-aware delays** — if using `ScheduleWakeup`, know that >300 seconds clears prompt cache; pick appropriate intervals
7. **No tool chaining** — don't call Bash to run linters, don't use Agent to search when Grep/Glob suffices

### Code Style Rules
- **Never add `cursor: pointer`** — Windows XP uses default cursor everywhere on custom UI
- **Don't gray inactive windows** — use desaturated blue (Luna), not gray (Windows Classic)
- **Build warnings are acceptable** — if asset loads at runtime, Vite "didn't resolve" is noise; don't fix unless asset actually fails
- **Minimal scope** — a bug fix doesn't trigger surrounding cleanup; don't refactor, don't abstract, don't add error handling for impossible cases
- **Don't rewrite for tiny fixes** — if two icons don't render, change the two lines; do NOT restructure imports, add type declarations, invent alternate approaches, or make sweeping "cleanup" edits across multiple files. Match existing patterns visible in nearby code.
- **Follow the established asset pattern** — icons and thumbnails come from ES-module imports in `src/components/files/data/icons.ts` (e.g. `Tour`, `TourPink`, `Icon7`, `Icon12`). New icons should be added as another `export { default as X } from '../../../img/X.webp';` line, then imported and used both as `icon:` and `thumbnailUrl:` on the file item. Do not fall back to `GenericIcon` for a file that has a specific asset available. Do not invent public-path URLs for files that live in `src/img/`.
- **Draggable title bars must exempt title-bar buttons from drag** — any window/modal whose title bar calls `handleMouseDown` from `useDraggable` will steal the mousedown on the close/help/minimize buttons, either capturing the click as a drag or moving the button out from under the cursor. Always guard: (1) in the title-bar's `onMouseDown`, early-return if `(e.target as HTMLElement).closest('.xp-title-control')` matches, AND (2) add `onMouseDown={(e) => e.stopPropagation()}` on each title-bar control button. Both belts and suspenders — one alone is not enough on slower devices. This bug recurs across modals; every new draggable dialog must apply this pattern.
- **Menu mnemonics** — every menu bar and submenu item wraps its Alt-accelerator character in `<span className='mnemonic'>X</span>`. Example: `<span className='mnemonic'>F</span>ile` for File menu (Alt+F), `<span className='mnemonic'>N</span>ew` for New submenu item (Alt+N). This is standard Windows UI and allows screen readers to announce the shortcut. See `SolitaireMenu.tsx` or `WordpadMenu.tsx` for the pattern applied across all menu bars (File, Edit, View, Help, etc.) and their submenus.
- **Global caret is transparent** — `index.css` starts with `* { caret-color: transparent }`. The exception is `input, textarea, [contenteditable], [contenteditable] *`. The `[contenteditable] *` part is REQUIRED: once the caret sits inside a `<p>`/`<span>` within a contentEditable, the element containing the caret is what determines its color — without the descendant selector the caret is invisible when clicking into existing text. If a new editable surface is added, make sure it's covered by this exception.
- **Never shadow lifted state with local state** — WordPad format-bar state (`tabStops`, `selectedFont`, etc.) lives in `Wordpad.tsx` and flows down as props. Do not redeclare `const [x, setX] = useState(...)` in a child for a value that already arrives as a prop — the local copy silently swallows updates (this broke tab stops: the modal wrote to a shadowed local state the editor never saw).
- **Don't lie in summaries** — after an edit fails or is only partially wired, say so. Do not describe a fix chain as complete when a ref/prop is declared but never connected.
- **No comments unless WHY is non-obvious** — don't document WHAT (names do that) or reference current task
- **JSX comments:** `{/* Title Case */}` for sections; logic blocks use `// lowercase comment` above useEffect/helper

### Git Workflow
- **Create new commits, not amendments** — when pre-commit hooks fail, fix the issue and commit fresh
- **Never use `git reset --hard` or destructive operations** — unless user explicitly asks
- **Never skip hooks** — if a hook fails, diagnose and fix the root cause
- **Never force-push to shared branches** — warn user before any force operation

## Commands

Run all from `minesweeper/`:

```bash
npm run dev       # Vite dev server (http://localhost:5173)
npm run build     # tsc -b && vite build
npm run lint      # ESLint over .ts/.tsx
npm run preview   # Preview production build locally
npm run deploy    # Build + publish dist/ to gh-pages
```

**No `npm test`** — no test runner configured.

**Vite base:** `/Windows-XP/` (subpath on GitHub Pages) — keep this in mind for absolute paths.

## Architecture

### App Root — `src/App.tsx`

Single source of truth for window state, z-ordering, and lifecycle.

**Per-app state pattern:**
- `is<App>Open: boolean` — mount/unmount gate
- `const <app> = useWindowState()` — owns `isMinimized`, `isFullscreen`, toggles
- `handle<App>Minimize` — sound-aware minimize wrapper (plays `playMinimize` down, `playStart` up)
- `open<App>()` — opens-or-restores-and-focuses helper

**Z-ordering:** `windowOrder: WindowId[]` array. `bringToFront(id)` moves to end. Render loop: `windowOrder.map(renderWindow)` produces DOM in stacking order. Every window calls `onMouseDown={() => bringToFront(id)}`.

**Adding a new app requires:**
1. Add `WindowId` literal type
2. Add `useWindowState()` instance + `is<App>Open` flag + minimize handler
3. Add render branch in `renderWindow()`
4. Wire desktop icon, Footer props, StartMenu entry
5. Register in `vite.config.ts` `manualChunks`

**Boot/shutdown:**
- `LoginScreen` → `LoadingScreen` (XPLoading) → desktop
- `ShutdownScreen` overlays on log-off/turn-off → 3s `fadeToBlack` → login or restart
- Login screen gates browser autoplay — sounds blocked before first user interaction

### Per-App Structure

Each app: `src/components/<AppName>/`

**Conventions:**
- `<App>.tsx` — chrome (title bar, dragging, minimize/close/fullscreen, menu bar)
- `<App>App.tsx` — inner application content
- `<App>Menu.tsx` — File/Edit/View menu bar (optional for simple apps)

**Chrome props from App.tsx (fixed contract):**
```tsx
onClose: () => void
isMinimized: boolean
setIsMinimized: (value: boolean | ((prev: boolean) => boolean)) => void
isFullscreen: boolean
toggleFullscreen: () => void
onMouseDown: () => void
isActive: boolean
// App-specific content props vary
```

**DO NOT invent new prop shapes** — match existing apps so App.tsx wiring stays consistent.

**Footer props (taskbar + Start Menu):** Thread through Footer.tsx for every app.
```tsx
is<App>Open: boolean
<app>Minimized: boolean
setMinimized: (value: boolean | ((prev: boolean) => boolean)) => void
on<App>Open: () => void
// Other app-specific props
```

### Current Apps (18 total)

| App | Location | Chrome | Menu | Content |
|-----|----------|--------|------|---------|
| **Minesweeper** | `src/components/minesweeper/` | `OneGame.tsx` | `GameMenu.tsx` | `Game.tsx` |
| **Notepad** | `src/components/notepad/` | `Notepad.tsx` | `NotepadMenu.tsx` | `NotepadApp.tsx` |
| **WordPad** | `src/components/wordpad/` | `Wordpad.tsx` | `WordpadMenu.tsx` | `WordpadApp.tsx` |
| **Paint** | `src/components/Paint/` | `Paint.tsx` | `PaintMenu.tsx` | `PaintApp.tsx` + 8 helpers |
| **Calculator** | `src/components/Calculator/` | `Calculator.tsx` | `CalculatorMenu.tsx` | `CalculatorApp.tsx` + Scientific |
| **Terminal** | `src/components/Terminal/` | `TerminalWindow.tsx` | none | `Terminal.tsx` |
| **Internet Explorer** | `src/components/IE/` | `IEWindow.tsx` | `IEMenu.tsx` | iframe (no App) |
| **File Manager** | `src/components/files/` | `FileManager.tsx` | `FileManagerMenu.tsx` | `FileManagerApp.tsx` + views |
| **Solitaire** | `src/components/solitaire/` | `Solitaire.tsx` | `SolitaireMenu.tsx` | `SolitaireApp.tsx` + pile types |
| **Media Player** | `src/components/mediaPlayer/` | `MediaPlayer.tsx` | `MediaPlayerMenu.tsx` | `MediaPlayerApp.tsx` |
| **Keyboard** | `src/components/keyboard/` | `Keyboard.tsx` | `KeyboardMenu.tsx` | `KeyboardApp.tsx` |
| **Display Properties** | `src/components/display-properties/` | `DisplayProperties.tsx` | none | embedded |
| **Volume Control** | `src/components/volume-control/` | `VolumeControl.tsx` | `VolumeControlMenu.tsx` | — |
| **Run Dialog** | `src/components/runDialog/` | `Run.tsx` | none | embedded |
| **Windows Plus!** | `src/components/plus/` | `PlusMain.tsx` | none | embedded |

### Hooks (`src/hooks/`)

- **`useWindowState`** — minimize/fullscreen toggles for one window
- **`useDraggable` / `useDraggableDialog`** — pointer-driven drag for windows and modals
- **`useSound`** — wraps audio imports, gates on per-hook `enabled` flag. **Each call creates independent state** — Minesweeper mute ≠ global mute. (If global mute needed, refactor here.)
- **Paint hooks:**
  - `usePaintHistory` — undo/redo stack
  - `usePaintSelection` — rect/free-form selection state
  - `usePaintShapeDrawing` — line/rect/ellipse/polygon logic
  - `usePaintPanning` — canvas scroll + zoom
  - `usePaintFileActions` — open/save/new/export
- **`useCalculatorLogic`** — full standard + scientific state machine

### WordPad Editor Specifics (contentEditable + selection)

The editor is a contentEditable div (`.text-window`); the caret/selection is global browser state and is **destroyed the moment the user clicks a modal, another window, or Paint**. Any feature that inserts at the caret (Insert Object, Paintbrush embed, Date/Time, Paragraph formatting) must use the save/restore pattern:

1. **Save on menu click:** `WordpadMenu`'s `<menu onMouseDown>` calls `e.preventDefault()` (keeps editor selection alive) and clones the current range into `savedFontSelection` ref.
2. **Hand off before long detours:** for flows that leave WordPad entirely (Paint embed), copy the range into `Wordpad.tsx`'s `savedSelectionRef` before starting; the insertion effect restores it when data returns.
3. **Restore before inserting:** `editor.focus()` alone resets the caret to the START of the document — always restore the saved range after focusing, then insert. Never rely on `window.getSelection()` being valid after a modal interaction.
4. **Insert with `range.collapse(false)`, never `range.deleteContents()`** — a stale restored range can span existing content and deleteContents wipes it.
5. Paragraph-level formatting: walk up from `range.startContainer` to the element whose `parentElement === editor` — that block is the target paragraph. Fall back to the whole editor only when no saved caret exists.

Symptom table: "inserts at beginning of document" → saved range not restored (step 3). "Previous content deleted on insert" → deleteContents on stale range (step 4). "Caret invisible" → see caret-color rule in Code Style.

### Minesweeper Specifics

- **Board model:** `src/data/game.ts` — `CellData`, `BoardConfig`, three difficulties
- **Mine placement:** `src/utils/generateMines.ts` — after first click, excludes clicked cell + neighbors (safe-first-click)
- **Flood fill:** `src/utils/floodFill.ts` — reveals connected empty region
- **Best times:** `localStorage` per difficulty, caps at 999s

### Bundling

`vite.config.ts` defines `manualChunks` (one chunk per app to avoid monolithic bundle):
```
minesweeper, ie, paint, calculator, terminal, notepad, wordpad, login, loading,
footer, startmenu, errorbubble, criticalerror, shutdownscreen, shutdowndisplay,
filemanager, solitaire, mediaPlayer, keyboard, displayProperties, volumeControl, runDialog, plus
```

**When adding a new app:** add an entry or it will inline into the main chunk (bad for performance).

### Styling

**Pure CSS, no framework.** Luna colors and bevel utilities are CSS custom properties in `App.css` / `index.css`, reused everywhere. Each component has a sibling `.css` file.

**Section headers in CSS:**
```css
/* ─────────────────────────────────────────
   Section Name
───────────────────────────────────────── */
```

**Custom XP assets:**
- Scrollbars (styled via `::-webkit-scrollbar`)
- Font assets: `src/fonts/tahoma.ttf`, `src/fonts/digital-7.ttf`
- XP bevel/shadow effects via `box-shadow` and `inset`

### Assets

- **Images:** `src/img/` — `.webp` only, imported as ES modules (Vite fingerprints + code-splits)
- **Sounds:** `src/sounds/` — `.wav` / `.mp3`, imported as ES modules
- **Reference only (not bundled):** repo root `ICON/`, `Icons2/`, `Windows XP High Resolution Icon Pack/`

## Common Tasks

### Add a New App

Window rendering goes through `WindowsRender.tsx` (not App.tsx directly). App.tsx owns state and passes everything to WindowRenderer as props. The full wiring touches 4 files: `App.tsx`, `WindowsRender.tsx`, `StartMenu.tsx`, `vite.config.ts`.

#### 1. Create component files
- `src/components/<AppName>/<App>.tsx` — chrome (title bar, drag, minimize/close)
- `src/components/<AppName>/<App>.css`
- Optional: `<App>App.tsx` (content), `<App>Menu.tsx` (menu bar)

**Required props shape** (must match existing apps exactly):
```tsx
interface Props {
    onClose: () => void;
    isMinimized: boolean;
    setIsMinimized: (value: boolean | ((prev: boolean) => boolean)) => void;
    isFullscreen: boolean;
    toggleFullscreen: () => void;
    onMouseDown?: () => void;
    isActive?: boolean;
    globalVolume: number;
    globalMuted: boolean;
    plusTheme?: PlusTheme;
    // app-specific props after this
}
```

#### 2. App.tsx — 6 edits

```tsx
// a) Import icon (near top with other icon imports)
import <App>Icon from './img/<App>.webp';

// b) useWindowState (near other useWindowState calls, ~line 88)
const <app> = useWindowState();

// c) Open flag (near other useState flags, ~line 107)
const [is<App>Open, setIs<App>Open] = useState(false);

// d) Minimize handler (in minimize handlers block, ~line 380)
const handle<App>Minimize = makeMinimizeHandler(
    () => <app>.isMinimized,
    <app>.setIsMinimized
);

// e) Open helper (after openVolumeControl, ~line 612)
const open<App> = makeOpenHandler(is<App>Open, setIs<App>Open, <app>.isMinimized, handle<App>Minimize, '<app>');

// f) Desktop icon (in desktop icons JSX block, ~line 757)
<div
    className='desktop-item'
    data-tooltip='...'
    onDoubleClick={open<App>}
>
    <img className='app-icon' src={<App>Icon} alt='...' />
    <span className='desktop-item-label'>...</span>
</div>

// g) Footer apps array entry (in footerApps array, ~line 655)
{ id: '<app>', isOpen: is<App>Open, isMinimized: <app>.isMinimized, setMinimized: handle<App>Minimize, onOpen: open<App>, icon: <App>Icon, label: '...' },

// h) WindowRenderer call site — add these props:
is<App>Open={is<App>Open}
<app>={<app>}
handle<App>Minimize={handle<App>Minimize}
onClose<App>={() => { playMinimize(); setIs<App>Open(false); removeFromOrder('<app>'); }}

// i) StartMenu call site — add:
on<App>Open={open<App>}
```

#### 3. WindowsRender.tsx — 5 edits

```tsx
// a) Import
import <App> from './<AppName>/<App>';

// b) Props interface — add in each section:
is<App>Open: boolean;                                              // open flags section
<app>: WindowState;                                               // window states section
handle<App>Minimize: (v: boolean | ((p: boolean) => boolean)) => void;  // minimize handlers section
onClose<App>: () => void;                                         // close handlers section

// c) Destructure — mirror the interface additions in the function params

// d) renderWindow branch (before the 'error' branch at the end):
if (id === '<app>' && is<App>Open) return (
    <<App>
        key='<app>'
        onClose={onClose<App>}
        isMinimized={<app>.isMinimized}
        setIsMinimized={handle<App>Minimize}
        isFullscreen={<app>.isFullscreen}
        toggleFullscreen={<app>.toggleFullscreen}
        onMouseDown={() => bringToFront('<app>')}
        isActive={isActive}
        globalVolume={globalVolume}
        globalMuted={globalMuted}
        plusTheme={plusTheme}
    />
);
```

**Note:** Do NOT add `open<App>` to WindowRendererProps unless the app actually needs to open another app from within itself. Unused props cause TS errors.

#### 4. StartMenu.tsx — 3 edits

```tsx
// a) Import icon
import <App>Icon from '../../img/<App>.webp';

// b) Add to ModalProps interface + destructuring
on<App>Open: () => void;

// c) Add menu item in All Programs panel (after Display Properties item)
<div
    className='menu-item'
    onClick={() => { on<App>Open(); playStart(); }}
>
    <img src={<App>Icon} alt='...' />
    ...App Name...
</div>
```

**Footer.tsx needs no changes** — it renders apps from the `apps: AppState[]` array passed from App.tsx dynamically.

#### 5. vite.config.ts

```ts
<app>: ['./src/components/<AppName>/<App>.tsx'],
```

### Fix a Bug

1. **Don't** rewrite files unless explicitly asked
2. **Use Edit** for targeted changes
3. **Verify** with Read only if change affects dependent code
4. **No cleanup** — if fixing a bug, don't refactor surrounding code
5. **Test in browser** before declaring done (UI changes especially)

### Update Styles

1. **Respect project conventions** — copy section header format from App.css / Footer.css
2. **Use existing CSS vars** — `--space-*`, `--xp-*`, `--border-*`, `--font-size-*` (defined in index.css)
3. **No new colors** — use Luna theme vars unless adding a new theme
4. **Keep selectors flat** — nest only for media queries or `:hover/:active`

## Token Efficiency Checklist

- [ ] Using Haiku 4.5 model
- [ ] All file paths are exact (full C:\ paths)
- [ ] Not reading files I've already read in this session
- [ ] Making single Edit calls (not re-reading after edit)
- [ ] Not running `tsc`, `eslint`, `npm test` unless asked
- [ ] Using Grep/Glob instead of Agent for simple searches
- [ ] Not using Bash to run dev server or linters
- [ ] Asking user before changes outside requested scope
- [ ] Creating new git commits (not amending) on hook failure
- [ ] Avoiding long chains of dependent tool calls

## Questions or Blockers

- `/help` — Claude Code help
- Report issues: https://github.com/anthropics/claude-code/issues
- For repo-specific questions, ask the user directly (they wrote CLAUDE.md)

## AI Communication & Token Economy Rules

### 1. Response Directness
- Skip ALL pleasantries and meta-commentary (e.g., do NOT write "Sure, I can help", "Here is the code", "Let me know if this works").
- Start responses directly with the solution, code fragment, or core answer.
- Confirm understanding or setup requests in exactly one sentence.

### 2. Code Economy
- NEVER output an entire file if only a small part changes.
- Show ONLY the specific function, hook, or block being modified.
- Use placeholders like `// ... existing imports ...` or `// ... rest of the component logic ...` for unchanged code.
- Provide clear anchor lines before and after the change so the user knows exactly where to paste it.
- Respect the strict minimal scope rule: do not refactor surrounding code unless explicitly asked.

### 3. Feature Planning (Architecture Filter)
- For any new feature request, you MUST first provide a max 5-bullet conceptual plan (pseudocode).
- This plan must explicitly address how the Selection/Caret will be preserved using the WordPad Editor Specifics rules.
- Do NOT generate full code until the user explicitly approves this concept.

### 4. Bug Analysis & Stop-Principle
- When analyzing bugs, cross-reference symptoms immediately with the "WordPad Editor Specifics" symptom table.
- If a user request lacks context, or if code snippets/exact paths are missing, do NOT guess or write placeholder code. Stop immediately, explain the issue in max 2 sentences, and ask for clarification.

