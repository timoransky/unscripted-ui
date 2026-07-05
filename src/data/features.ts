/**
 * The single registry behind everything support-related:
 * - SupportBadgeStyles.astro generates one @supports block per feature (live badges)
 * - SupportBadge.astro renders the badge span
 * - SupportTable.astro renders the static support/fallback table
 *
 * supportsQuery is a CSS @supports condition. It is null for HTML-only
 * features (attributes/elements) — @supports can only test CSS, and we
 * ship no JS to detect them, so those get a table row but no live badge.
 * When the query tests a correlated CSS feature instead of the feature
 * itself, `proxy` says so and the UI discloses it.
 */
export interface FeatureInfo {
  label: string;
  supportsQuery: string | null;
  proxy?: string;
  /** Minimum stable version, "no" when unsupported, "?" pending fact-check. */
  support: { chrome: string; edge: string; firefox: string; safari: string };
  fallback: string;
  mdn: string;
}

export const FEATURES = {
  dialog: {
    label: '<dialog> element',
    supportsQuery: 'selector(::backdrop)',
    support: { chrome: '37', edge: '79', firefox: '98', safari: '15.4' },
    fallback:
      'Baseline, widely available. Modal behavior, focus handling and Esc-to-close are native.',
    mdn: 'https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/dialog',
  },
  'dialog-invokers': {
    label: 'Invoker commands (commandfor / command)',
    supportsQuery: null,
    support: { chrome: '135', edge: '135', firefox: '144', safari: '26.2' },
    fallback:
      'Buttons with commandfor do nothing. Until Baseline, open the dialog with a 3-line shim or from your framework.',
    mdn: 'https://developer.mozilla.org/en-US/docs/Web/API/Invoker_Commands_API',
  },
  closedby: {
    label: 'closedby="any" (light dismiss)',
    supportsQuery: null,
    support: { chrome: '134', edge: '134', firefox: '141', safari: 'no' },
    fallback:
      'Esc still closes the dialog (platform default); clicking the backdrop does not.',
    mdn: 'https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/dialog#closedby',
  },
  popover: {
    label: 'Popover API',
    supportsQuery: 'selector(:popover-open)',
    support: { chrome: '114', edge: '114', firefox: '125', safari: '17' },
    fallback:
      'Content renders in normal document flow, always visible, and the trigger does nothing.',
    mdn: 'https://developer.mozilla.org/en-US/docs/Web/API/Popover_API',
  },
  'discrete-transitions': {
    label: 'Entry/exit animations (allow-discrete + @starting-style)',
    supportsQuery: '(transition-behavior: allow-discrete)',
    proxy:
      '@supports cannot test at-rules, so the badge checks transition-behavior: allow-discrete, which co-shipped with @starting-style in every engine.',
    support: { chrome: '117', edge: '117', firefox: '129', safari: '17.4' },
    fallback: 'Elements appear and disappear instantly. Nothing breaks — you just lose the animation.',
    mdn: 'https://developer.mozilla.org/en-US/docs/Web/CSS/transition-behavior',
  },
  'anchor-positioning': {
    label: 'CSS anchor positioning',
    supportsQuery: '(anchor-name: --a)',
    support: { chrome: '125', edge: '125', firefox: '147', safari: '26' },
    fallback:
      'The popover opens centered in the viewport (the top-layer default) instead of attached to its trigger.',
    mdn: 'https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_anchor_positioning',
  },
  'details-content': {
    label: '::details-content pseudo-element',
    supportsQuery: 'selector(::details-content)',
    support: { chrome: '131', edge: '131', firefox: '143', safari: '18.4' },
    fallback: 'Panels open and close instantly, without the height animation.',
    mdn: 'https://developer.mozilla.org/en-US/docs/Web/CSS/::details-content',
  },
  'interpolate-size': {
    label: 'interpolate-size: allow-keywords',
    supportsQuery: '(interpolate-size: allow-keywords)',
    support: { chrome: '129', edge: '129', firefox: 'no', safari: 'no' },
    fallback: 'height: auto cannot be interpolated, so content snaps open instead of easing.',
    mdn: 'https://developer.mozilla.org/en-US/docs/Web/CSS/interpolate-size',
  },
  'details-name': {
    label: 'Exclusive accordions (<details name>)',
    supportsQuery: null,
    support: { chrome: '120', edge: '120', firefox: '130', safari: '17.2' },
    fallback: 'All panels can be open at the same time — still fully functional.',
    mdn: 'https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/details#name',
  },
  'base-select': {
    label: 'Customizable select (appearance: base-select)',
    supportsQuery: '(appearance: base-select)',
    support: { chrome: '135', edge: '135', firefox: '149', safari: '27' },
    fallback:
      'Falls back to the classic native select — fully functional and accessible, just not custom-styled.',
    mdn: 'https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Forms/Customizable_select',
  },
  'scroll-markers': {
    label: 'CSS carousels (::scroll-marker / ::scroll-button)',
    supportsQuery: 'selector(::scroll-marker)',
    support: { chrome: '135', edge: '135', firefox: 'no', safari: 'no' }, // still Chromium-only per BCD 2026-07
    fallback: 'The carousel still scrolls and snaps; dots and arrow buttons simply do not render.',
    mdn: 'https://developer.mozilla.org/en-US/docs/Web/CSS/::scroll-marker',
  },
  'user-invalid': {
    label: ':user-invalid validation styling',
    supportsQuery: 'selector(:user-invalid)',
    support: { chrome: '119', edge: '119', firefox: '88', safari: '16.5' },
    fallback: 'No live invalid styling; the field still validates normally on submit.',
    mdn: 'https://developer.mozilla.org/en-US/docs/Web/CSS/:user-invalid',
  },
  'field-sizing': {
    label: 'field-sizing: content',
    supportsQuery: '(field-sizing: content)',
    support: { chrome: '123', edge: '123', firefox: '152', safari: '26.2' },
    fallback: 'The textarea keeps its fixed rows height and scrolls.',
    mdn: 'https://developer.mozilla.org/en-US/docs/Web/CSS/field-sizing',
  },
} as const satisfies Record<string, FeatureInfo>;

export type FeatureKey = keyof typeof FEATURES;

export const FEATURE_KEYS = Object.keys(FEATURES) as [FeatureKey, ...FeatureKey[]];
