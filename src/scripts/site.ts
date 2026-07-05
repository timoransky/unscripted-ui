// The docs site's entire JavaScript budget: copy-to-clipboard and the theme
// toggle. The components themselves ship none.

document.addEventListener('click', (event) => {
  const target = event.target instanceof Element ? event.target : null;
  if (!target) return;

  const copyButton = target.closest<HTMLButtonElement>('[data-copy]');
  if (copyButton) {
    const pre = copyButton.closest('[data-code-pane]')?.querySelector('pre');
    if (!pre) return;
    navigator.clipboard.writeText(pre.innerText.trimEnd()).then(() => {
      copyButton.setAttribute('data-copied', '');
      window.setTimeout(() => copyButton.removeAttribute('data-copied'), 1500);
    });
    return;
  }

  if (target.closest('[data-theme-toggle]')) {
    const dark = document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  }
});
