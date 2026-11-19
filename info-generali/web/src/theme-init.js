document.documentElement.classList.add('m-enter');
try {
  const savedScheme = localStorage.getItem('color-scheme') ?? 'light dark';
  const metaColorScheme = document.querySelector('meta[name="color-scheme"]');
  if (metaColorScheme) metaColorScheme.content = savedScheme;
  const isDark = (savedScheme === 'dark' || savedScheme === 'light')
    ? (savedScheme === 'dark')
    : window.matchMedia('(prefers-color-scheme: dark)').matches;
  document.documentElement.dataset.theme = isDark ? 'dark' : 'light';
  const mtc = document.getElementById('meta-theme-color');
  if (mtc) mtc.content = isDark ? '#070d19' : '#f4f7fb';
} catch {}
