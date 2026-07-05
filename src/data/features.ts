/**
 * The single registry behind everything support-related:
 * - SupportBadgeStyles.astro generates one @supports block per feature (live badges)
 * - SupportBadge.astro renders the badge span
 * - SupportTable.astro renders the static support/fallback table
 *
 * Browser versions and Baseline status are NOT hardcoded here — they resolve at
 * build time from @mdn/browser-compat-data (per-key versions) and web-features
 * (Baseline status) in ./support.ts, so a dependency bump refreshes the site.
 *
 * supportsQuery is a CSS @supports condition. It is null for HTML-only
 * features (attributes/elements) — @supports can only test CSS, and we
 * ship no JS to detect them, so those get a table row but no live badge.
 * When the query tests a correlated CSS feature instead of the feature
 * itself, `proxy` says so and the UI discloses it.
 */
export interface FeatureInfo {
  label: string;
  /** Short name shown inside the live badge pill. */
  short: string;
  supportsQuery: string | null;
  proxy?: string;
  /** BCD paths; a browser counts as supporting the feature only if it supports ALL keys. */
  bcd: string[];
  /** web-features id for the Baseline status chip. */
  webFeature?: string;
  fallback: string;
  mdn: string;
}

export const FEATURES = {
  dialog: {
    label: '<dialog> element',
    short: 'dialog',
    supportsQuery: 'selector(::backdrop)',
    bcd: ['html.elements.dialog'],
    webFeature: 'dialog',
    fallback:
      'Baseline, widely available. Modal behavior, focus handling and Esc-to-close are native.',
    mdn: 'https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/dialog',
  },
  'dialog-invokers': {
    label: 'Invoker commands (commandfor / command)',
    short: 'invoker commands',
    supportsQuery: null,
    bcd: ['html.elements.button.commandfor'],
    webFeature: 'invoker-commands',
    fallback:
      'Buttons with commandfor do nothing. Until Baseline reaches your audience, open the dialog with a 3-line shim or from your framework.',
    mdn: 'https://developer.mozilla.org/en-US/docs/Web/API/Invoker_Commands_API',
  },
  closedby: {
    label: 'closedby="any" (light dismiss)',
    short: 'closedby',
    supportsQuery: null,
    bcd: ['html.elements.dialog.closedby'],
    webFeature: 'dialog-closedby',
    fallback:
      'Esc still closes the dialog (platform default); clicking the backdrop does not.',
    mdn: 'https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/dialog#closedby',
  },
  popover: {
    label: 'Popover API',
    short: 'popover',
    supportsQuery: 'selector(:popover-open)',
    bcd: ['html.global_attributes.popover'],
    webFeature: 'popover',
    fallback:
      'Content renders in normal document flow, always visible, and the trigger does nothing.',
    mdn: 'https://developer.mozilla.org/en-US/docs/Web/API/Popover_API',
  },
  'discrete-transitions': {
    label: 'Entry/exit animations (allow-discrete + @starting-style)',
    short: 'exit animations',
    supportsQuery: '(transition-behavior: allow-discrete)',
    proxy:
      '@supports cannot test at-rules, so the badge checks transition-behavior: allow-discrete, which co-shipped with @starting-style in every engine.',
    bcd: ['css.properties.transition-behavior', 'css.at-rules.starting-style'],
    webFeature: 'transition-behavior',
    fallback: 'Elements appear and disappear instantly. Nothing breaks — you just lose the animation.',
    mdn: 'https://developer.mozilla.org/en-US/docs/Web/CSS/transition-behavior',
  },
  'anchor-positioning': {
    label: 'CSS anchor positioning',
    short: 'anchor positioning',
    supportsQuery: '(anchor-name: --a)',
    bcd: ['css.properties.anchor-name', 'css.properties.position-area'],
    webFeature: 'anchor-positioning',
    fallback:
      'The popover opens centered in the viewport (the top-layer default) instead of attached to its trigger.',
    mdn: 'https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_anchor_positioning',
  },
  'details-content': {
    label: '::details-content pseudo-element',
    short: 'details-content',
    supportsQuery: 'selector(::details-content)',
    bcd: ['css.selectors.details-content'],
    webFeature: 'details-content',
    fallback: 'Panels open and close instantly, without the height animation.',
    mdn: 'https://developer.mozilla.org/en-US/docs/Web/CSS/::details-content',
  },
  'interpolate-size': {
    label: 'interpolate-size: allow-keywords',
    short: 'interpolate-size',
    supportsQuery: '(interpolate-size: allow-keywords)',
    bcd: ['css.properties.interpolate-size'],
    webFeature: 'interpolate-size',
    fallback: 'height: auto cannot be interpolated, so content snaps open instead of easing.',
    mdn: 'https://developer.mozilla.org/en-US/docs/Web/CSS/interpolate-size',
  },
  'details-name': {
    label: 'Exclusive accordions (<details name>)',
    short: 'exclusive details',
    supportsQuery: null,
    bcd: ['html.elements.details.name'],
    webFeature: 'details-name',
    fallback: 'All panels can be open at the same time — still fully functional.',
    mdn: 'https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/details#name',
  },
  'base-select': {
    label: 'Customizable select (appearance: base-select)',
    short: 'base-select',
    supportsQuery: '(appearance: base-select)',
    bcd: ['css.properties.appearance.base-select', 'html.elements.selectedcontent'],
    webFeature: 'customizable-select',
    fallback:
      'Falls back to the classic native select — fully functional and accessible, just not custom-styled.',
    mdn: 'https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Forms/Customizable_select',
  },
  'scroll-markers': {
    label: 'CSS carousels (::scroll-marker / ::scroll-button)',
    short: 'CSS carousels',
    supportsQuery: 'selector(::scroll-marker)',
    bcd: ['css.selectors.scroll-marker', 'css.selectors.scroll-button'],
    webFeature: 'scroll-markers',
    fallback: 'The carousel still scrolls and snaps; dots and arrow buttons simply do not render.',
    mdn: 'https://developer.mozilla.org/en-US/docs/Web/CSS/::scroll-marker',
  },
  'user-invalid': {
    label: ':user-invalid validation styling',
    short: ':user-invalid',
    supportsQuery: 'selector(:user-invalid)',
    bcd: ['css.selectors.user-invalid'],
    webFeature: 'user-pseudos',
    fallback: 'No live invalid styling; the field still validates normally on submit.',
    mdn: 'https://developer.mozilla.org/en-US/docs/Web/CSS/:user-invalid',
  },
  'field-sizing': {
    label: 'field-sizing: content',
    short: 'field-sizing',
    supportsQuery: '(field-sizing: content)',
    bcd: ['css.properties.field-sizing'],
    webFeature: 'field-sizing',
    fallback: 'The textarea keeps its fixed rows height and scrolls.',
    mdn: 'https://developer.mozilla.org/en-US/docs/Web/CSS/field-sizing',
  },
} as const satisfies Record<string, FeatureInfo>;

export type FeatureKey = keyof typeof FEATURES;

export const FEATURE_KEYS = Object.keys(FEATURES) as [FeatureKey, ...FeatureKey[]];
