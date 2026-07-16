# unscripted/ui

shadcn-style components rebuilt on raw web platform primitives. Every interaction —
opening, closing, animating, positioning, dismissing — is HTML + CSS. Components ship
**zero JavaScript**.

## How it works

- **Copy-paste, Tailwind-only.** Each component is an HTML fragment styled with Tailwind v4
  utilities, including the newer platform-facing ones: `starting:` (`@starting-style`),
  `transition-discrete`, `details-content:`, `backdrop:`, arbitrary variants for things like
  `::picker(select)` and anchor positioning properties.
- **Semantic tokens, shadcn contract.** Classes like `bg-primary` / `border-border` map to the
  same CSS variables shadcn/ui uses — existing shadcn themes work unchanged. Everyone else
  pastes one `@theme` block from the Getting Started page.
- **The fallback must be functional.** Leading-edge features degrade to working UI: a select
  without `base-select` is the classic native select, a dropdown without anchor positioning
  opens centered, a carousel without `::scroll-marker` still scrolls.
- **Live support badges.** Component pages detect feature support in *your* browser with
  `@supports` blocks — no JS, no UA sniffing. Static tables carry exact versions
  (from `@mdn/browser-compat-data`) and fallback behavior.

## Development

```sh
npm install
npm run dev      # localhost:4321 (Astro 7 runs it as a daemon; `npx astro dev stop` to stop)
npm run build    # static output in dist/
```

## Repo layout

```
src/demos/<component>/<example>.html   the copyable fragments — single source of truth,
                                       rendered live AND highlighted as code
src/content/components/*.mdx           one docs page per component (title, order, features)
src/data/features.ts                   feature registry → live badges + support tables
src/components/ComponentPreview.astro  preview/code switcher (built with the library's own
                                       zero-JS radio-tabs technique)
src/styles/global.css                  the token contract; Getting Started slices its paste
                                       from this file at build time
src/scripts/site.ts                    the docs site's entire JS budget: copy buttons,
                                       theme toggle, and a dialog shim for browsers
                                       without invoker commands
reference/pure-css-ui-preview.html     the original proof-of-concept
```

## The one rule

A component may ship a `required.css` block only when its effect is genuinely impossible to
express as utilities, and the page must explain why. Current count: **4** (Carousel's
generated `::scroll-marker` / `::scroll-button` pseudo-elements, Marquee's `@keyframes`
block, Scroll Indicator's `@keyframes` for the scroll-driven progress bar, and Slider's
registered `@property` + `view-timeline` track fill).
