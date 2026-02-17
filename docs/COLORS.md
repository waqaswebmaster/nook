# Color tokens — variables & usage reference

A concise reference for the project's color system: where tokens are defined, what each token means, and representative places they are used in the codebase.  
Edit values in `src/lib/design-system.css` (single source of truth).

---

## Overview ✨

- Colors are defined as CSS custom properties in `:root` at `src/lib/design-system.css`.
- Tokens are semantic (primary, success, danger, text, background, border, gradients) — use tokens in components instead of hard-coded hex values.
- Shadows and border tokens reference the color tokens (e.g. `--shadow-brutalist-*` uses `--color-border-primary`).

## Where tokens live 🔧

- Definitions: `src/lib/design-system.css` (look for `:root { --color-... }`).
- Primary consumers: `src/routes/+layout.svelte` (global layout/header/footer) and components under `src/lib/components/*` (chat, whisper, tts, background-remover, common UI).

---

## Token list (current values)

| Variable                                  |                 Value | Purpose / usage                                    |
| ----------------------------------------- | --------------------: | -------------------------------------------------- |
| `--color-black`                           |             `#111827` | Base dark color (not usually used directly)        |
| `--color-white`                           |             `#ffffff` | Base white (text inverse / surfaces)               |
| `--color-gray-100` ... `--color-gray-900` | `#f9fafb` → `#1f2937` | Neutral scale for subtle surfaces and borders      |
| `--color-primary`                         |             `#0ac4e0` | Primary action / brand color (buttons, highlights) |
| `--color-primary-dark`                    |             `#1f8cd6` | Darker primary (gradients, active states)          |
| `--color-primary-hover`                   |             `#0992c2` | Hover / emphasis for primary elements              |
| `--color-secondary`                       |             `#f6e7bc` | Secondary surfaces / subtle accents                |
| `--color-success`                         |             `#f6e7bc` | Success state & positive badges                    |
| `--color-success-hover`                   |             `#f9d983` | Hover variant for success                          |
| `--color-danger`                          |             `#dc2626` | Error / destructive actions                        |
| `--color-danger-hover`                    |             `#b91c1c` | Hover variant for danger                           |
| `--color-warning`                         |             `#d97706` | Warnings / important non-fatal states              |
| `--color-warning-hover`                   |             `#b45309` | Hover variant for warning                          |
| `--color-accent-blue`                     |             `#3da5e9` | Small accents / gradients                          |
| `--color-accent-light-blue`               |             `#e0f2fe` | Accent background                                  |
| `--color-background-main`                 |             `#ffffff` | Default page/card background                       |
| `--color-background-secondary`            |             `#f9fafb` | Secondary surfaces (card interiors)                |
| `--color-background-tertiary`             |             `#f3f4f6` | Subtle surfaces / panels                           |
| `--color-background-disabled`             |             `#e5e7eb` | Disabled UI background                             |
| `--color-background-pattern`              |             `#f3f4f6` | Pattern/striped backgrounds                        |
| `--color-border-primary`                  |             `#1f2937` | Primary border & the "brutalist" shadow color      |
| `--color-border-secondary`                |             `#374151` | Secondary border                                   |
| `--color-text-primary`                    |             `#111827` | Main copy / headings color                         |
| `--color-text-secondary`                  |             `#374151` | Secondary copy / captions                          |
| `--color-text-tertiary`                   |             `#6b7280` | Tertiary copy / meta text                          |
| `--color-text-disabled`                   |             `#9ca3af` | Disabled text                                      |
| `--color-text-inverse`                    |             `#ffffff` | Text on dark/primary backgrounds                   |
| `--color-text-danger`                     |             `#dc2626` | Error text                                         |
| `--color-gradient-gold/lavender/mint`     |             `#f3f4f6` | Subtle gradients used in backgrounds and accents   |

(Full definitions are in `src/lib/design-system.css` under `:root`.)

---

## Representative usage (where to look) 📁

- Global layout / header / footer: `src/routes/+layout.svelte` — uses `--color-background-*`, `--color-primary`, `--color-text-*`, `--color-border-primary`, `--color-gradient-gold`.
- Buttons / primary actions: `src/lib/components/common/PrimaryButton.svelte`, `ActionButton.svelte` — use `--color-primary`, `--color-success`, `--color-danger`.
- Chat UI: `src/lib/components/chat/*` — uses `--color-primary-dark`, `--color-success`, `--color-danger`, gradients built from primary/hover tokens.
- Whisper / Transcribe UI: `src/lib/components/whisper/*` — uses `--color-background-main`, `--color-primary-dark`, `--color-success`, `--color-danger`.
- TTS UI: `src/lib/components/tts/*` — uses `--color-primary`, `--color-primary-hover`, `--color-background-main`.
- Background remover: `src/lib/components/background-remover/*` — uses `--color-accent-blue`, `--color-success`, `--color-danger`, `--color-primary-dark`.
- Token/count pages and small accents: `src/routes/[[lang]]/count-tokens/*` — several accent/background tokens used.

Tip: search the repo for `var(--color-` to find all usages.

---

## Usage references (file:line examples)

Below are representative file:line locations where each semantic token is defined or commonly used. Use these examples to find and update color usage quickly.

- `--color-primary`
  - `src/lib/design-system.css:81` (definition)
  - `src/routes/+layout.svelte:489` (header/menu primary background)
  - `src/lib/components/common/PrimaryButton.svelte:50` (primary button)
  - `src/lib/components/chat/MessageInput.svelte:212` (chat input gradient)

- `--color-primary-dark`
  - `src/lib/design-system.css:82` (definition)
  - `src/lib/components/whisper/TranscriptionProgress.svelte:122` (progress header)
  - `src/lib/components/common/StepHeader.svelte:26` (step header background)

- `--color-primary-hover`
  - `src/lib/design-system.css:83` (definition)
  - `src/lib/components/tts/SpeedControl.svelte:80` (hover state)
  - `src/lib/components/common/ProgressBar.svelte:41` (progress gradient)

- `--color-background-main`
  - `src/lib/design-system.css:99` (definition)
  - `src/routes/+layout.svelte:414` (global page/card background)
  - `src/lib/components/common/LanguageSelector.svelte:84` (component surface)

- `--color-background-secondary`
  - `src/lib/design-system.css:100` (definition)
  - `src/routes/+layout.svelte:554` (footer / panels)
  - `src/lib/components/count-tokens/TokenStats.svelte:38` (panel surface)

- `--color-background-tertiary`
  - `src/lib/design-system.css:101` (definition)
  - `src/routes/[[lang]]/text-to-speech/+page.svelte:753` (panel background)
  - `src/lib/components/common/LanguageSelector.svelte:173` (list background)

- `--color-background-disabled`
  - `src/lib/design-system.css:102` (definition)
  - `src/routes/+layout.svelte:606` (disabled surface example)
  - `src/routes/+layout.svelte:722` (`.primary-button:disabled` style)

- `--color-text-primary`
  - `src/lib/design-system.css:110` (definition)
  - `src/routes/+layout.svelte:317` (global text color)
  - `src/lib/components/whisper/TranscriptionProgress.svelte:117` (component text)

- `--color-text-secondary`
  - `src/lib/design-system.css:111` (definition)
  - `src/routes/[[lang]]/text-to-speech/+page.svelte:624` (secondary labels)
  - `src/routes/[[lang]]/count-tokens/+layout.svelte:88` (caption text)

- `--color-text-tertiary`
  - `src/lib/design-system.css:112` (definition)
  - `src/routes/+layout.svelte:563` (muted footer note)
  - `src/routes/favicon/+page.svelte:540` (meta text)

- `--color-text-disabled`
  - `src/lib/design-system.css:113` (definition)
  - `src/routes/+layout.svelte:607` (disabled text example)

- `--color-text-inverse`
  - `src/lib/design-system.css:114` (definition)
  - `src/routes/favicon/+page.svelte:442` (inverse text)
  - `src/lib/components/whisper/AudioRecorder.svelte:210` (button text on dark bg)

- `--color-text-danger`
  - `src/lib/design-system.css:115` (definition)
  - `src/lib/components/whisper/AudioRecorder.svelte:171` (error/alert text)

- `--color-border-primary`
  - `src/lib/design-system.css:106` (definition)
  - `src/routes/+layout.svelte:418` (global "brutalist" shadows/borders)
  - `src/lib/components/common/ActionButton.svelte:68` (button shadow)

- `--color-border-secondary`
  - `src/lib/design-system.css:107` (definition)
  - (used rarely; prefer `--color-border-primary` for prominent borders)

- `--color-gradient-gold`
  - `src/lib/design-system.css:118` (definition)
  - `src/routes/+layout.svelte:484` (subtle gradient background)
  - `src/lib/components/common/LoadingProgress.svelte:88` (progress gradient)

- `--color-success`
  - `src/lib/design-system.css:87` (definition)
  - `src/lib/components/whisper/TranscriptionProgress.svelte:158` (success state)
  - `src/lib/components/count-tokens/TokenStats.svelte:48` (positive badge)

- `--color-danger`
  - `src/lib/design-system.css:89` (definition)
  - `src/lib/components/whisper/TranscriptionProgress.svelte:292` (error state)
  - `src/lib/components/background-remover/BackgroundRemoverUpload.svelte:548` (danger / remove action)

- `--color-warning`
  - `src/lib/design-system.css:91` (definition)
  - `src/lib/components/background-remover/BackgroundRemoverResult.svelte:345` (warning accent)
  - `src/routes/[[lang]]/text-to-speech/+page.svelte:811` (warning panel)

- `--color-accent-blue`
  - `src/lib/design-system.css:95` (definition)
  - `src/lib/components/background-remover/BackgroundRemoverUpload.svelte:249` (accent gradient)
  - `src/lib/components/count-tokens/TokenStats.svelte:52` (accent badge)

- `--color-accent-light-blue`
  - `src/lib/design-system.css:96` (definition)
  - (not used widely in code; add if you need a soft blue surface)

---

## How to change a token ✅

1. Edit the value in `src/lib/design-system.css` inside `:root`.
2. Run formatting and checks:

   ```bash
   npm run format
   npm run checks
   ```

3. Start dev server to visually verify: `npm run dev`.

Notes:

- Prefer changing token values (not component CSS) so updates are global.
- If you need a new semantic color, add `--color-<purpose>` to `:root` and use it where appropriate.

---

## Best practices & accessibility ✨

- Use semantic tokens (`--color-text-primary`, `--color-background-main`, `--color-primary`) instead of raw hex values.
- Keep contrast in mind for text over backgrounds (WCAG AA minimum for body text). Use `--color-text-inverse` on dark/primary backgrounds.
- Use `--color-*-hover` tokens for hover/active states and `--color-*-dark` for stronger emphasis.

---

## Quick examples

- Apply a primary button background:
  ```css
  .btn-primary {
  	background: var(--color-primary);
  	color: var(--color-text-inverse);
  }
  ```
- Card surface:
  ```css
  .card {
  	background: var(--color-background-main);
  	border: var(--border-brutalist-thin);
  }
  ```

---

If you want, I can:

- Add a generated color palette PNG into `/static` and include it in the README ✅
- Produce a table of color contrast ratios for key foreground/background pairs ⚠️

Tell me which of the above you want next.
