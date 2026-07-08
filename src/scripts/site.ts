// The docs site's entire JavaScript budget: copy-to-clipboard and the theme
// toggle. The components themselves ship none.

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

  // "Copy page" — fetch the page's Markdown twin and put it on the clipboard.
  const copyPage = target.closest<HTMLButtonElement>('[data-copy-page]');
  if (copyPage) {
    const flag = (name: string) => {
      copyPage.setAttribute(name, '');
      window.setTimeout(() => copyPage.removeAttribute(name), 1500);
    };
    fetch(copyPage.getAttribute('data-copy-page') ?? '')
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.text();
      })
      .then((markdown) => navigator.clipboard.writeText(markdown))
      .then(() => flag('data-copied'))
      .catch(() => flag('data-copy-failed'));
    return;
  }

  if (target.closest('[data-theme-toggle]')) {
    const dark = document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  }
});
