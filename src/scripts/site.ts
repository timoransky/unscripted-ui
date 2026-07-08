// The docs site's entire JavaScript budget: copy-to-clipboard, the theme
// toggle, and linkable section headings. The components themselves ship none.

// Detected once on the prototype — TS also narrows an instance `in` check
// on HTMLButtonElement to `never`, since its lib already declares `command`.
const supportsInvokerCommands = 'command' in HTMLButtonElement.prototype;

document.addEventListener('click', (event) => {
  const target = event.target instanceof Element ? event.target : null;
  if (!target) return;

  // Shim so dialog demos stay usable in browsers without invoker commands.
  // The copied component code does NOT include this — see the support table.
  const invoker = target.closest<HTMLButtonElement>('button[commandfor]');
  if (invoker && !supportsInvokerCommands) {
    const commandTarget = document.getElementById(invoker.getAttribute('commandfor') ?? '');
    if (commandTarget instanceof HTMLDialogElement) {
      const command = invoker.getAttribute('command');
      if (command === 'show-modal' && !commandTarget.open) commandTarget.showModal();
      if (command === 'close') commandTarget.close();
    }
    return;
  }

  // Section anchors: copy the section's URL to the clipboard. We don't
  // preventDefault, so the browser still scrolls and drops the hash into the
  // address bar — the fallback way to grab the link if clipboard is denied.
  const headingAnchor = target.closest<HTMLAnchorElement>('[data-heading-anchor]');
  if (headingAnchor) {
    const url = new URL(headingAnchor.getAttribute('href') ?? '', location.href).href;
    navigator.clipboard
      .writeText(url)
      .then(() => {
        headingAnchor.setAttribute('data-copied', '');
        window.setTimeout(() => headingAnchor.removeAttribute('data-copied'), 1500);
      })
      .catch(() => {
        // Clipboard access can be denied; the address bar still holds the link.
      });
    return;
  }

  const copyButton = target.closest<HTMLButtonElement>('[data-copy]');
  if (copyButton) {
    const pre = copyButton.closest('[data-code-pane]')?.querySelector('pre');
    if (!pre) return;
    navigator.clipboard
      .writeText(pre.innerText.trimEnd())
      .then(() => {
        copyButton.setAttribute('data-copied', '');
        window.setTimeout(() => copyButton.removeAttribute('data-copied'), 1500);
      })
      .catch(() => {
        // Clipboard access can be denied (permissions policy, non-secure context).
        copyButton.setAttribute('data-copy-failed', '');
        window.setTimeout(() => copyButton.removeAttribute('data-copy-failed'), 1500);
      });
    return;
  }

  if (target.closest('[data-theme-toggle]')) {
    const dark = document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  }
});

// Turn every docs subheading into a linkable anchor. Markdown headings already
// carry an `id` (Astro slugifies them); this slugify is only a fallback for the
// hand-written docs pages, and matches github-slugger closely enough for them.
function slugify(text: string): string {
  return text
    .trim()
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-');
}

function makeHeadingsLinkable(): void {
  const headings = document.querySelectorAll<HTMLHeadingElement>(
    '.docs-prose :is(h2, h3)',
  );
  const used = new Set<string>();
  for (const heading of headings) if (heading.id) used.add(heading.id);

  for (const heading of headings) {
    let id = heading.id;
    if (!id) {
      const base = slugify(heading.textContent ?? '') || 'section';
      id = base;
      for (let n = 1; used.has(id); n++) id = `${base}-${n}`;
      used.add(id);
      heading.id = id;
    }

    const anchor = document.createElement('a');
    anchor.className = 'heading-anchor';
    anchor.href = `#${id}`;
    anchor.setAttribute('data-heading-anchor', '');
    anchor.setAttribute('aria-label', 'Copy link to this section');
    heading.append(anchor);
  }
}

makeHeadingsLinkable();
