// === arrondissements.js ===
import { map } from './map.js';
import { loadGeoJSON, addGeoJSONSource } from './dataLoader.js';

export async function initArrondissements(path) {
  const data = await loadGeoJSON(path);
  addGeoJSONSource('arrondissements', data);

  if (!map.getLayer('arrondissements-layer')) {
    map.addLayer({
      id: 'arrondissements-layer',
      type: 'line',
      source: 'arrondissements',
      layout: { visibility: 'none' },   // masqué au départ
      paint: { 'line-color': '#000', 'line-width': 2 }
    });
  }
}

export function toggleArrondissements(visible) {
  if (map.getLayer('arrondissements-layer')) {
    map.setLayoutProperty(
      'arrondissements-layer',
      'visibility',
      visible ? 'visible' : 'none'
    );
  }
}
