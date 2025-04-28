// === app.js ===
import { initMap } from './map.js';
import { initSidebar } from './sidebar.js';
import { loadGeoJSON, addGeoJSONSource } from './dataLoader.js';
import { initArrondissements, toggleArrondissements } from './arrondissements.js';
import { calculateScore, getColor } from './score.js';

async function main() {
  // 1) Initialise la carte
  const map = initMap();
  await new Promise(res => map.on('load', res));

  // 2) Arrondissements (masqués par défaut)
  await initArrondissements('arrondissements.json');
  let arrVisible = false;
  const btnArr = document.getElementById('toggleArrondissements');
  if (btnArr) {
    btnArr.addEventListener('click', () => {
      arrVisible = !arrVisible;
      toggleArrondissements(arrVisible);
    });
  }

  // 3) Chargement des hexagones
  let hexData = null;
  const btnLoad = document.getElementById('loadHexGrid');
  if (btnLoad) {
    btnLoad.addEventListener('click', async () => {
      if (!hexData) {
        hexData = await loadGeoJSON('Quartier_MTL.json');
      }
      addGeoJSONSource('hexgrid', hexData);

      if (!map.getLayer('hexgrid-layer')) {
        map.addLayer({
          id: 'hexgrid-layer',
          type: 'fill',
          source: 'hexgrid',
          paint: {
            'fill-color': '#ccc',
            'fill-opacity': 0.5
          }
        });

        // Clic sur un hexagone
        map.on('click', 'hexgrid-layer', e => {
          const feature = e.features[0];
          const props   = feature.properties;

          // Nom du quartier
          const quartier = props.NOM_OFFICIEL || props.name || 'Quartier inconnu';

          // Critères cochés
          const checked = Array
            .from(document.querySelectorAll('.criterion:checked'))
            .map(cb => cb.value);

          // Labels personnalisés
          const labels = {
            'nbr_poste_police':    'Nombre de postes de police',
            'Nbr_crimes':          'Nombre de crimes',
            'Nbr_Caserne_pompier': 'Nombre de casernes de pompiers',
            'Nbr_hopitaux':        'Nombre d’hôpitaux',
            'Nbr_college':         'Nombre de collèges',
            'Nbr_université':      'Nombre d’universités',
            'nbr_resto_commerces': 'Commerce / Resto',
            'Nbr_Arret_STM':       'Arrêts STM',
            'Nbr_parc':            'Parcs',
            'Score_Sécurité':      'Score Sécurité',
            'Score_Education':     'Score Éducation',
            'Score_Attraction':    'Score Attraction'
          };

          // Construction du contenu HTML
          let html = `<strong>${quartier}</strong><br/><br/>`;
          html += '<strong>Détails :</strong><br/>';
          checked.forEach(key => {
            const label = labels[key] || key;
            const value = props[key] != null ? props[key] : 0;
            html += `${label}: ${value}<br/>`;
          });

          // Calcul du score et commentaire
          const s = calculateScore(feature, checked);
          if (s >= 6) {
            html += '<br/><b>Waouhhh ! Ce quartier est top ! 👌</b>';
          } else if (s <= 2) {
            html += '<br/><b>Oups… On te le conseille pas trop 😬</b>';
          } else {
            html += '<br/><b>Pas mal ! Ça peut le faire 😉</b>';
          }

          // Affiche le popup MapLibre
          new maplibregl.Popup({ offset: 10 })
            .setLngLat(e.lngLat)
            .setHTML(html)
            .addTo(map);

          // Affiche le panneau info si présent
          const info = document.getElementById('info');
          const scoreEl = document.getElementById('scoreValue');
          if (info && scoreEl) {
            scoreEl.textContent = s;
            info.classList.remove('hidden');
          }
        });
      }
    });
  }

  // 4) Calcul global via la sidebar
  initSidebar(criteria => {
    if (!hexData) {
      alert("👉 Charge d'abord les hexagones !");
      return;
    }
    hexData.features.forEach(f => {
      const s = calculateScore(f, criteria);
      f.properties._score = s;
      f.properties._color = getColor(s);
    });
    map.getSource('hexgrid').setData(hexData);
    map.setPaintProperty('hexgrid-layer', 'fill-color', ['get', '_color']);
  });

  // 5) Fermer le panneau info (si le bouton existe)
  const infoClose = document.getElementById('infoClose');
  if (infoClose) {
    infoClose.addEventListener('click', () => {
      const info = document.getElementById('info');
      if (info) info.classList.add('hidden');
    });
  }
}

main();
