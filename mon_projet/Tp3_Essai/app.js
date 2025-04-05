// Initialiser la carte
const map = new maplibregl.Map({
    container: 'map', // ID de l'élément où la carte sera affichée
    style: 'https://api.maptiler.com/maps/dataviz/style.json?key=JhO9AmIPH59xnAn5GiSj', // URL du style de la carte
    center: [-73.5673, 45.5017], // Coordonnées de Montréal (longitude, latitude)
    zoom: 10, // Niveau de zoom initial
});
