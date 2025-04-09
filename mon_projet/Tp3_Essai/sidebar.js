export function initSidebar() {
  const sidebar = document.getElementById('sidebar');
  const toggle = document.getElementById('toggleSidebar');

  if (!sidebar || !toggle) {
    console.error("❌ Sidebar ou bouton non trouvé dans le DOM !");
    return;
  }

  toggle.addEventListener('click', () => {
    sidebar.classList.toggle('collapsed');
  });

  const form = document.getElementById('criteriaForm');
  if (!form) {
    console.error("❌ Formulaire de critères non trouvé !");
    return;
  }

  form.addEventListener('change', () => {
    const selected = Array.from(form.querySelectorAll('.criterion:checked'))
      .map(cb => cb.value);
    if (window.updateScoreByCriteria) {
      window.updateScoreByCriteria(selected);
    }
  });
}
