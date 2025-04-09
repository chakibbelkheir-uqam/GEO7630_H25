// === map.js ===
export let map;

export function initMap() {
  map = new maplibregl.Map({
    container: 'map',
    style: 'https://api.maptiler.com/maps/dataviz/style.json?key=JhO9AmIPH59xnAn5GiSj',
    center: [-73.56, 45.52],
    zoom: 10
  });

  map.addControl(new maplibregl.NavigationControl());
}