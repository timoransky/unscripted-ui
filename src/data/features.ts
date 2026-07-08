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
  'anchor-inset': {
    label: 'anchor() function positioning',
    short: 'anchor()',
    supportsQuery: '(anchor-name: --a)',
    proxy:
      '@supports cannot test the anchor() function inside a value, so the badge checks anchor-name: --a — anchor-name and anchor() shipped together in every engine.',
    bcd: ['css.properties.anchor-name', 'css.types.anchor'],
    webFeature: 'anchor-positioning',
    fallback:
      'An element positioned with the anchor() function falls back to its normal position, so an indicator that tracks another element simply does not move; the underlying content stays fully usable.',
    mdn: 'https://developer.mozilla.org/en-US/docs/Web/CSS/anchor',
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
  'scroll-state-scrolled': {
    label: 'Scroll-state query: scrolled (direction)',
    short: 'scrolled query',
    supportsQuery: '(container-type: scroll-state)',
    proxy:
      '@supports can’t test @container descriptors, so the badge checks container-type: scroll-state (Chrome 133) — but the scrolled query this uses only works from Chrome 144.',
    bcd: [
      'css.properties.container-type.scroll-state',
      'css.at-rules.container.scroll-state_queries.scrolled',
    ],
    webFeature: 'container-scroll-state-queries',
    fallback:
      'The header stays permanently visible — an ordinary sticky header. Nothing is hidden and no content is lost.',
    mdn: 'https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Conditional_rules/Container_scroll-state_queries',
  },
  'scroll-state-stuck': {
    label: 'Scroll-state query: stuck',
    short: 'stuck query',
    supportsQuery: '(container-type: scroll-state)',
    bcd: [
      'css.properties.container-type.scroll-state',
      'css.at-rules.container.scroll-state_queries.stuck',
    ],
    webFeature: 'container-scroll-state-queries',
    fallback: 'The docked header simply does not gain its elevation shadow.',
    mdn: 'https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Conditional_rules/Container_scroll-state_queries',
  },
  'scroll-state-scrollable': {
    label: 'Scroll-state query: scrollable',
    short: 'scrollable query',
    supportsQuery: '(container-type: scroll-state)',
    proxy:
      '@supports can’t test @container descriptors, so the badge checks container-type: scroll-state — the scrollable query landed alongside it in Chrome 133.',
    bcd: [
      'css.properties.container-type.scroll-state',
      'css.at-rules.container.scroll-state_queries.scrollable',
    ],
    webFeature: 'container-scroll-state-queries',
    fallback: 'The fade edges never appear; the panel still scrolls normally.',
    mdn: 'https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Conditional_rules/Container_scroll-state_queries',
  },
  'interest-invokers': {
    label: 'Interest invokers (interestfor + popover="hint")',
    short: 'interest invokers',
    supportsQuery: '(interest-delay-start: 0s)',
    bcd: ['html.elements.button.interestfor', 'css.properties.interest-delay-start'],
    webFeature: 'interest-invokers',
    fallback:
      'The hover UI simply never appears — triggers keep their aria-labels and links still navigate, so nothing is lost. If you need it everywhere today, the plain-CSS technique on the Tooltip page works in every browser.',
    mdn: 'https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/interestfor',
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
  'sibling-index': {
    label: 'sibling-index() function',
    short: 'sibling-index',
    supportsQuery: '(transition-delay: calc(sibling-index() * 1ms))',
    bcd: ['css.types.sibling-index'],
    webFeature: 'sibling-count',
    fallback:
      'The computed delay is invalid, so the declaration is dropped and every item animates at the same time — the entrance still plays, just without the cascade.',
    mdn: 'https://developer.mozilla.org/en-US/docs/Web/CSS/sibling-index',
  },
  'scroll-driven-animations': {
    label: 'Scroll-driven animations (view-timeline / timeline-scope)',
    short: 'scroll-driven',
    supportsQuery: '(animation-timeline: --t)',
    proxy:
      'The badge tests animation-timeline as a stand-in — the range fill also needs view-timeline, timeline-scope and @property, which all shipped together with scroll-driven animations in every engine that has them.',
    bcd: [
      'css.properties.animation-timeline',
      'css.properties.view-timeline',
      'css.properties.timeline-scope',
    ],
    webFeature: 'scroll-driven-animations',
    fallback:
      'WebKit/Chromium show a plain secondary track with no filled portion; Firefox still fills natively via ::-moz-range-progress. The slider stays fully usable — only the progress-style fill is missing.',
    mdn: 'https://developer.mozilla.org/en-US/docs/Web/CSS/animation-timeline',
  },
  'scrollbar-color': {
    label: 'Styled scrollbars (scrollbar-color / scrollbar-width)',
    short: 'scrollbar-color',
    supportsQuery: '(scrollbar-color: auto)',
    bcd: ['css.properties.scrollbar-color', 'css.properties.scrollbar-width'],
    webFeature: 'scrollbar-color',
    fallback:
      'You get the default platform scrollbar instead of the thin themed one — still fully scrollable.',
    mdn: 'https://developer.mozilla.org/en-US/docs/Web/CSS/scrollbar-color',
  },
  'scroll-driven-animations': {
    label: 'Scroll-driven animations (animation-timeline)',
    short: 'scroll timelines',
    supportsQuery: '(animation-timeline: scroll())',
    bcd: ['css.properties.animation-timeline.scroll'],
    webFeature: 'scroll-driven-animations',
    fallback:
      'The scroll-linked animation never runs; the element stays in its base state and the container still scrolls normally.',
    mdn: 'https://developer.mozilla.org/en-US/docs/Web/CSS/animation-timeline',
  },
} as const satisfies Record<string, FeatureInfo>;

export type FeatureKey = keyof typeof FEATURES;

export const FEATURE_KEYS = Object.keys(FEATURES) as [FeatureKey, ...FeatureKey[]];
