
// === sidebar.js ===
export function initSidebar() {
  const sidebar = document.getElementById('sidebar');
  const toggle = document.getElementById('toggleSidebar');

  toggle.addEventListener('click', () => {
    sidebar.classList.toggle('collapsed');
  });

  document.querySelectorAll('.criterion').forEach(input => {
    input.addEventListener('change', () => {
      const selected = Array.from(document.querySelectorAll('.criterion:checked'))
        .map(cb => cb.value);
      if (window.updateScoreByCriteria) {
        window.updateScoreByCriteria(selected);
      }
    });
  });
}
