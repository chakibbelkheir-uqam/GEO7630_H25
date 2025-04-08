// === dataLoader.js ===
import { map } from './map.js';

function getColorByScore(score) {
  return [
    '#d73027', '#fc8d59', '#fee08b', '#d9ef8b', '#91cf60', '#1a9850', '#006837'
  ][Math.max(0, Math.min(6, Math.floor(score) - 1))];
}

export function setupGeoJsonButton() {
  const btn = document.getElementById('loadGeoJson');
  btn.addEventListener('click', async () => {
    const res = await fetch('Quartier_MTL.json');
    const data = await res.json();

    data.features.forEach(f => {
      f.properties.score = f.properties.score_pondéré || f.properties.score_pondere || 0;
    });

    if (!map.getSource('quartiers')) {
      map.addSource('quartiers', { type: 'geojson', data });

      map.addLayer({
        id: 'quartiers-layer',
        type: 'fill',
        source: 'quartiers',
        paint: {
          'fill-color': [
            'interpolate', ['linear'], ['get', 'score'],
            1, '#d73027',
            2, '#fc8d59',
            3, '#fee08b',
            4, '#d9ef8b',
            5, '#91cf60',
            6, '#1a9850',
            7, '#006837'
          ],
          'fill-opacity': 0.6
        }
      });

      map.on('click', 'quartiers-layer', (e) => {
        const props = e.features[0].properties;
        document.getElementById('info').innerHTML = `
          <strong>${props.NOM_OFFICIEL}</strong><br/>
          Score: ${props.SCORE_QUARTIER}<br/>
          Police: ${props.nbr_poste_police || props.Nbr_poste_police || 0}<br/>
          Crimes: ${props.nbr_crimes || props.Nbr_crimes || 0}<br/>
          Pompiers: ${props.nbr_Caserne_pompier || props.Nbr_Caserne_pompier || 0}<br/>
          Hôpitaux: ${props.nbr_hopitaux || props.Nbr_hopitaux || 0}<br/>
          Collèges: ${props.nbr_college || props.Nbr_college || 0}<br/>
          Universités: ${props.nbr_universite || props.Nbr_université || 0}<br/>
          Commerces: ${props.nbr_resto_commerces || props.Nbr_resto_commerces || 0}<br/>
          STM: ${props.nbr_arret_stm || props.Nbr_Arret_STM || 0}<br/>
          Parcs: ${props.nbr_parc || props.Nbr_parc || 0}
        `;
      });
    } else {
      map.getSource('quartiers').setData(data);
    }

    window.updateScoreByCriteria = (criteres) => {
      data.features.forEach(feature => {
        let score = 0;
        criteres.forEach(c => {
          const lower = parseFloat(feature.properties["nbr_" + c]);
          const upper = parseFloat(feature.properties["Nbr_" + c]);
          score += !isNaN(lower) ? lower : (!isNaN(upper) ? upper : 0);
        });
        feature.properties.score = score;
      });
      map.setPaintProperty('quartiers-layer', 'fill-color', [
        'interpolate', ['linear'], ['get', 'score'],
        1, '#d73027',
        2, '#fc8d59',
        3, '#fee08b',
        4, '#d9ef8b',
        5, '#91cf60',
        6, '#1a9850',
        7, '#006837'
      ]);
      map.getSource('quartiers').setData(data);
    };
  });
}
// Ajouter la légende après l'initialisation
const legend = document.createElement('div');
legend.id = 'legend';
legend.innerHTML = `
  <h4>Légende des scores</h4>
  <div><span style="background:#d73027"></span> Score 1</div>
  <div><span style="background:#fc8d59"></span> Score 2</div>
  <div><span style="background:#fee08b"></span> Score 3</div>
  <div><span style="background:#d9ef8b"></span> Score 4</div>
  <div><span style="background:#91cf60"></span> Score 5</div>
  <div><span style="background:#1a9850"></span> Score 6</div>
  <div><span style="background:#006837"></span> Score 7</div>
`;
document.body.appendChild(legend);
