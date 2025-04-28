// === dataLoader.js ===
import { map } from './map.js';

// Charge et retourne un GeoJSON
export async function loadGeoJSON(path) {
  const res = await fetch(path);
  return res.json();
}

// Crée ou met à jour une source GeoJSON
export function addGeoJSONSource(id, data) {
  if (!map.getSource(id)) {
    map.addSource(id, { type: 'geojson', data });
  } else {
    map.getSource(id).setData(data);
  }
}
