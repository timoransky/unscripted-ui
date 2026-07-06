---
name: unscripted-ui
description: Implement UI components (button, dialog, dropdown, select, tabs, accordion, drawer, popover, tooltip, carousel, etc.) with unscripted/ui — shadcn-style components built as zero-JavaScript HTML + Tailwind v4 fragments. Use when adding UI components to a project that uses unscripted/ui, when asked for zero-JS / no-framework / pure-CSS components with the shadcn look, or when reviewing code that copied these fragments.
---

# unscripted/ui

shadcn-style components rebuilt on raw web platform primitives. Every interaction —
opening, closing, animating, positioning, dismissing — is HTML + CSS. Components ship
**zero JavaScript**: no framework, no package, no runtime. Each component is a
copy-paste HTML fragment styled with Tailwind v4 utilities, using the shadcn semantic
token contract (`bg-primary`, `border-border`, …), so existing shadcn themes work
unchanged.

## Workflow

1. **Check setup once per project** — the target needs Tailwind v4.1+ and the token
   contract. Follow `references/installation.md`. If the project already uses
   shadcn/ui, the tokens are already there; skip the theme paste.
2. **Pick the component** — `references/index.md` lists every component with its
   description and the leading-edge features it uses.
3. **Read `references/<component>.md`** — it contains the exact fragment(s) to copy,
   the explanation of how the technique works, and what happens in browsers that
   lack each feature. Copy the fragment verbatim, then adapt per the rules below.
4. **Check the fallback story fits the audience** — every fragment degrades to
   working UI without JS, but *what* it degrades to differs per component (see the
   "Leading-edge features" section of each reference). Tell the user when a
   component they asked for relies on a feature that is not yet Baseline.

## Adaptation rules

These fragments are meant to be edited — but there is a line between content and
mechanism:

- **Change freely:** text, labels, icons, item counts, widths, spacing, and any
  purely visual utilities. Variants are just different utility sets on the same
  element — there are no props, so "add a variant" means "edit classes".
- **Rename IDs, keep them wired:** fragments use `id` + `commandfor` /
  `popovertarget` / `for` / `aria-labelledby` / `anchor-name` pairs. IDs must be
  unique per page — when pasting a fragment twice or renaming, update **every**
  reference to the ID, not just the element.
- **Never delete mechanism classes**, even when they look odd or redundant:
  `starting:*`, `transition-discrete`, `open:*`, `backdrop:*`, `details-content:*`,
  `[appearance:base-select]`, `::picker(select)` arbitrary variants, anchor
  positioning properties (`[anchor-name:…]`, `[position-area:…]`,
  `[position-try-fallbacks:…]`), `snap-*`, `overscroll-*`, `scroll-marker-*`.
  These *are* the component's behavior. If an interaction breaks after edits,
  diff the classes against the reference fragment first.
- **Do not "fix" a fragment with JavaScript.** If something appears broken in the
  current browser, it is almost always a not-yet-shipped feature doing its
  documented fallback (check the reference's feature list) — not a bug. The one
  sanctioned exception is the optional dialog invoker shim in
  `references/installation.md`.
- **Do not add wrapper components, `variant` props, or state.** If the host project
  is React/Vue/etc., the fragment can be pasted into JSX/templates nearly as-is
  (in JSX rename `class` → `className`, `for` → `htmlFor`); it still needs no
  handlers, no refs, no effects.

## Styling rules

- **Use semantic tokens, never hardcoded colors:** `bg-background`, `text-foreground`,
  `bg-card`, `text-muted-foreground`, `border-border`, `border-input`, `bg-primary`,
  `bg-secondary`, `bg-accent`, `bg-destructive`, `outline-ring`, `rounded-lg` (from
  `--radius`). That keeps the component themeable and dark-mode-correct for free —
  the `dark` variant swaps variables, not classes.
- **Focus is `focus-visible:outline-*`**, not `focus:ring-*` — visible for keyboard,
  silent for mouse. Keep it on anything interactive.
- Buttons set `cursor-pointer` explicitly (Tailwind v4 no longer forces it), and a
  bare `<button>` inside a `<form>` submits — keep `type="button"` on anything that
  isn't the submit action.

## The one required-CSS rule

A component may ship a `required.css` block **only** when its effect is impossible to
express as utilities. Currently exactly one does: Carousel (generated
`::scroll-marker` / `::scroll-button` pseudo-elements need `content` and their own
layout). Everything else is utilities only — if you find yourself writing a custom
CSS block for any other component, you have drifted from the library's approach.

## Keeping this skill current

The `references/` files are generated from the unscripted/ui repository
(`npm run build:skill` in the repo) — demos, docs and the feature registry are the
single source of truth. If a reference seems stale or a component is missing,
regenerate from the current repo rather than hand-editing the references.
