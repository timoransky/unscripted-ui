import { getCollection } from 'astro:content';

export interface NavLink {
  href: string;
  title: string;
  featured: boolean;
}

export interface NavGroup {
  label: string;
  links: NavLink[];
}

// A handful of demos that best show off the platform get a subtle marker in the
// nav. The build throws if an id here is unknown, so the marker can't rot.
const SHOWCASE = new Set(['gallery', 'select', 'carousel', 'slider', 'header', 'nav-menu']);

// Single source of truth for the site navigation — shared by the desktop
// Sidebar and the mobile drawer so the two can never drift.
export async function getNavGroups(): Promise<NavGroup[]> {
  const components = await getCollection('components');

  const unknown = [...SHOWCASE].filter((id) => !components.some((c) => c.id === id));
  if (unknown.length) throw new Error(`Nav: unknown showcase ids: ${unknown.join(', ')}`);

  // One flat, alphabetical list — fastest to scan when you already know the name.
  const componentLinks = components
    .slice()
    .sort((a, b) => a.data.title.localeCompare(b.data.title))
    .map((c) => ({ href: `/components/${c.id}`, title: c.data.title, featured: SHOWCASE.has(c.id) }));

  return [
    {
      label: 'Docs',
      links: [
        { href: '/docs/introduction', title: 'Introduction', featured: false },
        { href: '/docs/installation', title: 'Installation', featured: false },
      ],
    },
    { label: 'Components', links: componentLinks },
  ];
}
