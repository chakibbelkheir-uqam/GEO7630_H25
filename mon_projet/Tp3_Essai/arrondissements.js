// === arrondissements.js ===
import { map } from './map.js';

export function handleArrondissements() {
  const btn = document.getElementById('toggleArrondissements');
  btn.addEventListener('click', async () => {
    const layerId = 'arrondissements-layer';

    if (!map.getSource('arrondissements')) {
      const res = await fetch('https://donnees.montreal.ca/dataset/9797a946-9da8-41ec-8815-f6b276dec7e9/resource/e18bfd07-edc8-4ce8-8a5a-3b617662a794/download/limites-administratives-agglomeration.geojson');
      const arrondissements = await res.json();

      map.addSource('arrondissements', { type: 'geojson', data: arrondissements });

      if (!map.getLayer(layerId)) {
        map.addLayer({
          id: layerId,
          type: 'line',
          source: 'arrondissements',
          paint: {
            'line-color': '#ff0000',
            'line-width': 0.5
          },
          layout: {
            'visibility': 'visible'
          }
        });
      }
    } else if (map.getLayer(layerId)) {
      const visibility = map.getLayoutProperty(layerId, 'visibility');
      map.setLayoutProperty(layerId, 'visibility', visibility === 'none' ? 'visible' : 'none');
    }
  });
}
