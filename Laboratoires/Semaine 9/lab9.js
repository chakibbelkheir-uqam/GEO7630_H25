// INITIALISER la carte MapLibre
var map = new maplibregl.Map({
    container: 'map',
    style: 'https://api.maptiler.com/maps/streets/style.json?key=JhO9AmIPH59xnAn5GiSj',
    center: [-73.55, 45.55],
    zoom: 12
});

// Variable globale pour stocker le GeoJSON
var geoJSONcontent;

// FONCTION pour charger un fichier GeoJSON
function handleFileSelect(evt) {
    const file = evt.target.files[0];
    const reader = new FileReader();

    reader.onload = function (theFile) {
        geoJSONcontent = JSON.parse(theFile.target.result); // 🔧 en global

        // Supprimer les anciennes sources/couches
        if (map.getLayer('geojson')) map.removeLayer('geojson');
        if (map.getLayer('geojson-label')) map.removeLayer('geojson-label');
        if (map.getSource('geojson-source')) map.removeSource('geojson-source');

        // Ajouter la source GeoJSON
        map.addSource('geojson-source', {
            'type': 'geojson',
            'data': geoJSONcontent
        });

        // Ajouter la couche principale (polygones)
        map.addLayer({
            'id': 'geojson',
            'type': 'fill',
            'source': 'geojson-source',
            'paint': {
                'fill-color': '#0080ff',
                'fill-opacity': 0.5
            }
        });

        // Ajouter les labels (sans icône !)
        map.addLayer({
            'id': 'geojson-label',
            'type': 'symbol',
            'source': 'geojson-source',
            'layout': {
                'text-field': ['get', 'operator_id'], // Modifie ici si tu veux un autre champ
                'text-size': 12,
                'icon-image': '' // 🔧 NE PAS afficher d’icône
            },
            'paint': {
                'text-color': '#202',
                'text-halo-color': '#fff',
                'text-halo-width': 2
            }
        });
    };

    reader.readAsText(file);
}

// ZOOMER sur le GeoJSON
function zoomToGeoJSON() {
    if (geoJSONcontent) {
        map.fitBounds(geojsonExtent(geoJSONcontent), {
            padding: 20
        });
    } else {
        alert("Please load a GeoJSON file first.");
    }
}

// COLORIER le GeoJSON avec des couleurs aléatoires selon operator_id
function colorPolygons() {
    if (geoJSONcontent) {
        map.setPaintProperty("geojson", "fill-color", {
            property: 'operator_id',
            stops: [
                [2, randomColor()],
                [3, randomColor()],
                [15, randomColor()],
                [20, randomColor()],
                [25, randomColor()],
                [30, randomColor()]
            ]
        });
    } else {
        alert("Please load a GeoJSON file first.");
    }
}

// Génère une couleur aléatoire
function randomColor() {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return `rgb(${r}, ${g}, ${b})`;
}

// 🔁 EVENTS
document.getElementById('file').addEventListener('change', handleFileSelect);
document.getElementById('zoomto').addEventListener('click', zoomToGeoJSON);
document.getElementById('colorier').addEventListener('click', colorPolygons);
