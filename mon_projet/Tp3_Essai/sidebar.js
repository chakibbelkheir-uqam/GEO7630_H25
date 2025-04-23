// === sidebar.js ===
export function initSidebar(onCalculate) {
  const sidebar = document.getElementById('sidebar');
  const toggle  = document.getElementById('toggleSidebar');
  const form    = document.getElementById('criteriaForm');
  const calcBtn = document.getElementById('calculateScore');
  let selectedCriteria = [];

  // Ouvrir/fermer sidebar
  toggle.addEventListener('click', () => sidebar.classList.toggle('collapsed'));

  // Mettre à jour critères
  form.addEventListener('change', () => {
    selectedCriteria = Array
      .from(form.querySelectorAll('.criterion:checked'))
      .map(cb => cb.value);

    if (selectedCriteria.length && selectedCriteria.length < 3) {
      alert("🔔 Pour une meilleure expérience, cochez au moins 3 critères !");
    }
  });

  // Bouton Calculer
  calcBtn.addEventListener('click', () => {
    onCalculate(selectedCriteria);
  });
}
