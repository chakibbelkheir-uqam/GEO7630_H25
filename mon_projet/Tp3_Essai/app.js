// Initialiser la carte
const map = new maplibregl.Map({
    container: 'map', // ID de l'élément où la carte sera affichée
    style: 'https://api.maptiler.com/maps/dataviz/style.json?key=JhO9AmIPH59xnAn5GiSj', // URL du style de la carte
    center: [-73.5673, 45.5017], // Coordonnées de Montréal (longitude, latitude)
    zoom: 12, // Niveau de zoom initial
});

// Ajouter un marqueur à Montréal
new maplibregl.Marker()
    .setLngLat([-73.5673, 45.5017]) // Coordonnées de Montréal
    .setPopup(new maplibregl.Popup().setText('Bienvenue à Montréal!')) // Popup qui s'affiche quand on clique sur le marqueur
    .addTo(map);
