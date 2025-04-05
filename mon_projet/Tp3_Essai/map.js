let map;

// Initialiser la carte avec MapLibre
function initializeMap() {
    map = new maplibregl.Map({
        container: 'map',
        style: 'https://api.maptiler.com/maps/dataviz/style.json?key=JhO9AmIPH59xnAn5GiSj',
        center: [-73.5673, 45.5017], // Montréal
        zoom: 12
    });

    map.on('load', function() {
        console.log('Carte chargée');
    });
}

// Charger un fichier GeoJSON
function loadGeoJSON(url, layerId) {
    if (map.isStyleLoaded()) {
        fetch(url)
            .then(response => response.json())
            .then(data => {
                map.addSource(layerId, {
                    type: 'geojson',
                    data: data
                });

                map.addLayer({
                    id: layerId,
                    type: 'circle',
                    source: layerId,
                    paint: {
                        'circle-radius': 5,
                        'circle-color': '#ff0000'
                    }
                });
            })
            .catch(error => console.error('Erreur de chargement GeoJSON:', error));
    } else {
        console.log('La carte n\'est pas encore prête.');
    }
}

document.addEventListener('DOMContentLoaded', function() {
    initializeMap();  // Initialiser la carte

    const loadParcsButton = document.getElementById('loadParcs');
    if (loadParcsButton) {
        loadParcsButton.addEventListener('click', function() {
            loadGeoJSON('https://donnees.montreal.ca/fr/dataset/2e9e4d2f-173a-4c3d-a5e3-565d79baa27d/resource/35796624-15df-4503-a569-797665f8768e/download/espace_vert.json', 'parcs');
        });
    }

    const loadCommercesButton = document.getElementById('loadCommerces');
    if (loadCommercesButton) {
        loadCommercesButton.addEventListener('click', function() {
            loadGeoJSON('https://donnees.montreal.ca/dataset/c1d65779-d3cb-44e8-af0a-b9f2c5f7766d/resource/ece728c7-6f2d-4a51-a36d-21cd70e0ddc7/download/businesses.geojson', 'commerces');
        });
    }

    const loadEcolesButton = document.getElementById('loadEcoles');
    if (loadEcolesButton) {
        loadEcolesButton.addEventListener('click', function() {
            loadGeoJSON('https://donnees.montreal.ca/fr/dataset/1eee09ec-d3b8-4c7d-ab6d-e85eb9fdd0b0/resource/ff47b841-19c3-4a9a-be32-68a71c187b64/download/eqcollegial.json', 'ecoles');
        });
    }
});
