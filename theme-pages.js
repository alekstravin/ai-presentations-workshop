const themeButton = document.querySelector('[data-theme-toggle]');

function applyResourceTheme(theme) {
  const resolved = theme === 'dark' ? 'dark' : 'light';
  document.documentElement.dataset.theme = resolved;
  const themeMeta = document.querySelector('meta[name="theme-color"]');
  if (themeMeta) themeMeta.content = resolved === 'dark' ? '#0a0a08' : '#f4efe5';
  localStorage.setItem('aiResourceTheme', resolved);
  if (themeButton) {
    themeButton.textContent = resolved === 'dark' ? '☀' : '☾';
    themeButton.setAttribute('aria-pressed', String(resolved === 'dark'));
    themeButton.title = resolved === 'dark' ? 'Включить светлую тему' : 'Включить тёмную тему';
  }
}

applyResourceTheme(document.documentElement.dataset.theme);
themeButton?.addEventListener('click', () => applyResourceTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark'));
