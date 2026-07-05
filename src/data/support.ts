/**
 * Build-time resolution of browser support data. Nothing here reaches the
 * client — the output is baked into static HTML.
 *
 * Versions come from @mdn/browser-compat-data (the dataset behind MDN's
 * compat tables); Baseline status comes from web-features (the dataset
 * behind MDN's Baseline banner). `npm update` refreshes both.
 */
import bcd from '@mdn/browser-compat-data';
import { features as webFeatures } from 'web-features';
import { FEATURES, type FeatureKey } from './features';

const BROWSERS = ['chrome', 'edge', 'firefox', 'safari'] as const;
export type Browser = (typeof BROWSERS)[number];

export interface ResolvedSupport {
  /** Minimum stable version per browser, or 'no'. */
  versions: Record<Browser, string>;
  /** 'high' = widely available, 'low' = newly available, false = limited, null = unknown. */
  baseline: 'high' | 'low' | false | null;
  /** Year the feature became Baseline newly-available, if it did. */
  baselineYear?: string;
}

function bcdVersion(path: string, browser: Browser): string {
  const entry = path
    .split('.')
    .reduce<any>((node, key) => node?.[key], bcd)?.__compat;
  if (!entry) throw new Error(`support.ts: BCD key not found: ${path}`);
  const raw = entry.support[browser];
  const first = Array.isArray(raw) ? raw[0] : raw;
  const version = first?.version_added;
  // false/null/undefined → unsupported; "preview" (e.g. Safari TP) → not stable.
  if (typeof version !== 'string' || version === 'preview') return 'no';
  return version.replace(/^≤/, '');
}

/** A browser supports a feature only if it supports ALL of its BCD keys. */
function mergedVersion(paths: readonly string[], browser: Browser): string {
  const versions = paths.map((path) => bcdVersion(path, browser));
  if (versions.includes('no')) return 'no';
  return versions.reduce((a, b) => (parseFloat(b) > parseFloat(a) ? b : a));
}

export function resolveSupport(key: FeatureKey): ResolvedSupport {
  const feature = FEATURES[key];
  const status = feature.webFeature ? webFeatures[feature.webFeature]?.status : undefined;

  const versions = Object.fromEntries(
    BROWSERS.map((browser) => [browser, mergedVersion(feature.bcd, browser)])
  ) as Record<Browser, string>;

  return {
    versions,
    baseline: status ? status.baseline : null,
    baselineYear: status?.baseline_low_date?.slice(0, 4),
  };
}
