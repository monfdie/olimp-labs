(() => {
  const root = document.documentElement;
  const key = 'olimp-theme';
  const meta = document.querySelector('meta[name="theme-color"]');

  function apply(theme) {
    root.dataset.theme = theme;
    meta.content = theme === 'light' ? '#f8faf5' : '#0d0f12';
  }

  let initial = 'dark';
  try {
    if (localStorage.getItem(key) === 'light') initial = 'light';
  } catch { /* Storage may be unavailable in private browsing. */ }
  apply(initial);

  document.addEventListener('DOMContentLoaded', () => {
    const button = document.querySelector('.theme-switch');
    function updateButton() {
      const light = root.dataset.theme === 'light';
      button.setAttribute('aria-pressed', String(light));
      button.title = light ? 'Увімкнути темну тему' : 'Увімкнути світлу тему';
    }
    updateButton();
    button.hidden = false;
    button.addEventListener('click', () => {
      const theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
      apply(theme);
      updateButton();
      try { localStorage.setItem(key, theme); } catch { /* Keep the choice for this page. */ }
    });
  });
})();
