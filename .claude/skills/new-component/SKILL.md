---
name: new-component
description: Add a new component (demo + docs page) to unscripted/ui, or edit an existing one. Use whenever creating, extending, or reviewing components, demo HTML fragments in src/demos/, docs pages in src/content/components/, or entries in the feature registry. Encodes the library's non-negotiable principles and file conventions.
---

# Adding a component to unscripted/ui

Every component here is an HTML fragment + a docs page. This skill is the contract both
must satisfy. Read it fully before writing markup — most review feedback in this repo is
about violating one of these rules, not about broken code.

## The non-negotiables

1. **Zero JavaScript.** Every interaction — opening, closing, animating, positioning,
   dismissing — must be HTML + CSS. If a behavior genuinely needs JS (toast queues,
   combobox filtering, roving-focus ARIA menus), the component does not belong in the
   library; the Introduction's "What's deliberately missing" section explains why.
2. **The fallback must be functional.** A leading-edge feature may *enhance*, never
   *carry*, the component. Ask: "in a browser without feature X, does this still work?"
   A select without `base-select` is the classic native select; a dropdown without anchor
   positioning opens centered; a carousel without `::scroll-marker` still scrolls. If the
   answer is "it breaks", redesign it.
3. **Utilities only.** The fragment is styled entirely with Tailwind v4 classes on the
   shadcn token contract (`bg-primary`, `border-border`, `text-muted-foreground`, …).
   A separate `required.css` file is allowed **only** when the effect is impossible to
   express as utilities (generated pseudo-elements needing `content`, like the carousel's
   `::scroll-marker`). The docs page must explain *why* it's impossible, and the README's
   "Current count" of required-CSS blocks must be updated.
4. **Docs and demo may not drift.** Every class name, attribute, and CSS variable the
   prose mentions must literally exist in the demo file. The demo renders live AND is the
   highlighted code — the prose is the only thing that can lie, so check it against the
   fragment line by line before finishing.
5. **Honesty over polish.** If the pattern bends semantics (Tabs announce as a radio
   group) or an engine can't do something (WebKit has no filled-track pseudo-element),
   say so plainly in the docs. Never bolt on ARIA roles to fake semantics the behavior
   doesn't back up.

## Files for one component

```
src/demos/<slug>/basic.html          the copyable fragment (more examples = more files)
src/demos/<slug>/<name>.css          ONLY for rule-3 exceptions (rare — currently 1 in the repo)
src/content/components/<slug>.mdx    the docs page
src/data/features.ts                 add an entry ONLY if you use a platform feature not yet registered
src/pages/index.astro                optional: add to SHOWCASE if it belongs on the landing page
```

There is no registration step beyond the `.mdx` file — the sidebar and routes come from
the content collection automatically.

## The demo fragment

- **IDs must be namespaced** with a component-unique prefix (`dlg-account`, `tt-bold`,
  `pop-dimensions`), because multiple demos render on the landing page together. Radio
  groups need a unique `name` for the same reason (`tabs-settings`, `acc-faq`).
- **Standard button recipes** — reuse these verbatim, don't invent new ones:
  - Outline (default trigger):
    `inline-flex h-9 cursor-pointer items-center justify-center gap-2 rounded-lg border border-input bg-transparent px-4 text-sm font-medium whitespace-nowrap text-foreground transition-colors hover:bg-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring`
  - Primary: swap the border/bg for `bg-primary text-primary-foreground transition-opacity hover:opacity-90`
  - Destructive: `bg-destructive text-white` and `focus-visible:outline-destructive`.
    There is **no** `--destructive-foreground` token (matches current shadcn) — use
    `text-white`.
- **`type="button"`** on every button whose job is UI control (triggers, close buttons,
  menu items, toolbar buttons). Fragments get pasted into other people's `<form>`s, where
  a bare `<button>` submits. Leave it off only for content stand-ins the user will
  repurpose (a lone "Save" button).
- **Accessible names are your job.** Native elements give you behavior, not names:
  `<dialog>` needs `aria-labelledby` (+ `aria-describedby` for confirms) pointing at its
  heading; icon-only buttons need `aria-label`; lone inputs need `aria-label`; grouped
  radios use `<fieldset>`/`<legend>`. `aria-hidden="true"` on every decorative SVG.
- **Focus visibility**: `focus-visible:outline-2 focus-visible:outline-offset-2
  focus-visible:outline-ring` (offset-1 on text inputs). For `sr-only` inputs styled via
  labels, forward it with `peer-focus-visible/<name>:outline-*` onto the label.
- **Color discipline**: semantic tokens for everything themed. Where a literal palette
  color is justified (status colors), the greens are **emerald** (`emerald-500`), never
  `green-*` — warn is `amber-500`, bad is `bg-destructive` or `red-400` on dark code
  panes. Anything that must stay visible in both themes uses tokens (`bg-background`
  thumb on the switch, `border-background` ring on avatars).
- **Motion**: the entry/exit animation recipe is base classes = closed state,
  `open:*` = open state, `starting:open:*` = the frame animated *from*
  (`@starting-style`), plus `transition-discrete` (`transition-behavior: allow-discrete`)
  so `display`/`overlay` survive the exit animation. Include `overlay` and `display` in
  the transition list for top-layer elements:
  `transition-[opacity,scale,overlay,display] transition-discrete duration-150`.
  Never add per-component reduced-motion handling — the global rule in the token paste
  covers everything.
- **Anchored popovers** (dropdown/popover pattern): `[anchor-name:--x]` on the trigger;
  `[position-anchor:--x] [position-area:block-end_span-inline-end]
  [position-try-fallbacks:flip-block]` on the panel. Keep `m-auto` in the base classes —
  that's the centered top-layer fallback for browsers without anchor positioning — and
  guard only the margin reset and transform origin:
  `supports-[anchor-name:--a]:m-0 supports-[anchor-name:--a]:mt-1.5
  supports-[anchor-name:--a]:origin-top-left`.
  **Exception:** if the element can only ever open via a Chromium-only mechanism
  (`interestfor`), the no-anchor fallback is unreachable — skip `m-auto` and the guards
  and write plain `mt-2 origin-top-left` (see hover-card, tooltip/toolbar).

### Tailwind v4 pitfalls (these have shipped real bugs here)

- CSS variables in arbitrary values need `var()` or parens: `content-[var(--chevron)]`
  or `content-(--chevron)`. Bare `content-[--chevron]` compiles to invalid CSS and the
  browser silently drops it.
- `peer-*` requires the peer input to be a **preceding sibling** of what it styles —
  structure radio-tabs and checkbox patterns as flat sibling lists.
- Tailwind v4 preflight zeroes all margins, including `<dialog>` and `[popover]` — the UA
  centering is gone, which is why dialogs carry `m-auto`. Don't remove it.
- Vendor pseudo-element selectors (`::-webkit-*`, `::-moz-*`) are safe because every
  utility compiles to its own rule — each engine ignores selectors it doesn't know. This
  is worth restating in docs when used.

## The docs page (.mdx)

Frontmatter schema (validated at build; the build **fails** on violations):

```yaml
title: Alert Dialog          # sidebar + h1
description: One or two sentences. State the capability and the mechanism, with a hook.
order: 25                    # components sort alphabetically — pick a number between neighbors
features: [dialog, dialog-invokers, discrete-transitions]   # keys from src/data/features.ts
plainCss: true               # ONLY if features is [] — schema rejects both set together
```

- `order`: the list is alphabetical by convention; find the two alphabetical neighbors'
  numbers and pick between them (Alert=20, Alert Dialog=25, Avatar=30).
- `plainCss` strictly means "uses no leading-edge platform feature at all". A functional
  fallback does NOT qualify a component for the flag.
- `features` drives the live `@supports` badges and the support table — list every
  leading-edge feature the demo uses, even enhancement-only ones.

Body structure (follow the existing pages; import `ComponentPreview` and reference the
demo as `<ComponentPreview demo="<slug>/basic" />`):

1. **`## How it works`** — bullets naming the exact classes/attributes and what each
   does. Bold the single load-bearing trick. Name real CSS behind Tailwind shorthand on
   first use: `` `transition-discrete` (`transition-behavior: allow-discrete`) ``.
2. **`## Accessibility`** — what the platform provides natively, what the copier must
   still do, and any semantic trade-off stated bluntly.
3. **`## The fallback story`** (when `features` is non-empty) — per feature: what a
   browser without it shows, and why that's still functional.

### Voice — say it straight

Write short declarative sentences that state behavior and mechanism. Explain *why* when
it changes what the copier should do, in one clause, not a story.

- **Cut scene-setting and metaphor from body prose.** If a sentence doesn't teach the
  reader something about the component, delete it. Real example from review:
  - Bad: "A Dialog is furniture — settings, previews, forms — and light dismiss is a
    courtesy: click anywhere outside and it's gone."
  - Good: "An alert dialog interrupts to demand a decision, usually a destructive one,
    so a stray click on the backdrop must not dismiss it."
  The bad version is filler dressed as insight; the good one is the whole point in one
  sentence. Flowery framing like this reads as AI-generated and got rewritten.
- **Go easy on em-dash asides and triads.** One "— like this —" flourish per paragraph
  at most; stacking them is padding. Prefer a second plain sentence over a decorated
  long one.
- **A bullet is one or two sentences.** If a bullet needs four, it is explaining more
  than the reader needs — keep the behavior and the mechanism, drop the rest.
- A frontmatter `description` may carry one dry hook ("A checkbox in a trench coat");
  body prose stays plain.
- Contrast with the JS-library way only when it makes a concrete point ("the autogrow
  JavaScript you've written five times is one CSS declaration now").
- Cross-link sibling components with relative links (`[Dialog](/components/dialog)`).
- No marketing fluff, no unexplained jargon, no claims the demo doesn't back.

## The feature registry (src/data/features.ts)

Only touch this when the demo uses a platform feature with no existing key. An entry:

- `supportsQuery`: a CSS `@supports` condition for the live badge — or `null` for
  HTML-only features (attributes/elements can't be detected without JS; they get a table
  row but no badge, disclosed by the ‡ footnote automatically).
- `proxy`: set when the query tests a *correlated* feature rather than the feature
  itself, and say so honestly in the text (rendered as the † footnote).
- `bcd`: MDN browser-compat-data paths; a browser counts as supporting only if it
  supports ALL keys — list every co-required key. A wrong path **fails the build**.
- `webFeature`: the web-features id for the Baseline chip (omit if none exists).
- `fallback`: one or two sentences of *actual behavior* when missing — this renders in
  the "When missing" column, and it may appear on several component pages, so phrase it
  component-neutrally.

Never hardcode browser versions anywhere — they resolve at build time from
`@mdn/browser-compat-data`.

## Landing page (optional)

Add an entry to `SHOWCASE` in `src/pages/index.astro` only if the demo is visually
self-explanatory at card size. Order matters: the first half of the map is the left
column, the second half the right, and mobile stacks in map order. A SHOWCASE id without
a matching content entry fails the build.

## Verify before you're done

```sh
npm run check   # typecheck + frontmatter schema (plainCss/features exclusivity, feature keys)
npm run build   # fails on missing demos, bad BCD paths, moved token-paste markers
```

Both must pass — CI runs exactly these. Then re-read the prose against the demo one last
time (rule 4), and confirm every id in the fragment is prefixed uniquely (open the
landing page mentally: would this collide?). If you added a `required.css`, update the
README's count and justify it on the page.
