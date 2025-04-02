  
  // Au chargement
  map.on('load', function () {
    // Source des zones piétonnes
    map.addSource('zones_pietonnes_source', {
      type: 'geojson',
      data: 'https://donnees.montreal.ca/fr/dataset/1e153f9f-3930-4133-8d35-ade2e8f7e7e3/resource/dfe003f6-2dd1-4c50-af68-154a914421cc/download/projetpietonnisation2017.geojson' // GeoJSON des zones piétonnes
    });
  
    // Source des zones scolaires
    map.addSource('parcs_source', {
      type: 'geojson',
      data: 'https://donnees.montreal.ca/fr/dataset/2e9e4d2f-173a-4c3d-a5e3-565d79baa27d/resource/35796624-15df-4503-a569-797665f8768e/download/espace_vert.json' // GeoJSON des zones scolaires
    });
  
    // Couche des zones piétonnes
    map.addLayer({
      id: 'pietonnes',
      type: 'circle',
      source: 'zones_pietonnes_source',
      paint: {
        'circle-color': 'red',
        'circle-radius': 10,

      }
    });
  
    // Couche des zones scolaires
    map.addLayer({
      id: 'parcs',
      type: 'fill',
      source: 'parcs_source',
      paint: {
        'fill-color': 'darkgreen',
        'fill-opacity': 0.6
      }
    });
  
    // Couche de surlignement dynamique
    map.addLayer({
      id: 'highlighted',
      type: 'fill',
      source: 'parcs_source',
      paint: {
        'fill-color': 'orange',
        'fill-opacity': 0.6
      },
      filter: ['in', 'OBJECTID', ''] // Filtre vide au départ
    });
  });
  
  // Interaction : survol des zones piétonnes pour détecter les zones scolaires intersectées
  map.on('mousemove', 'pietonnes', function (e) {
    const features = e.features;
  
    if (!features.length) return;
  
    const zonePietonne = features[0];
    const zonePietonneBuffer = turf.buffer(zonePietonne, 500, {units: 'meters'});
    const bbox = turf.bbox(zonePietonneBuffer);
    const candidates = map.queryRenderedFeatures({ bbox: bbox, layers: ['parcs'] });
  
    const intersecting = candidates.filter(z => {
      return turf.booleanIntersects(zonePietonneBuffer, z);
    });
  
    console.log(intersecting)
    const ids = intersecting.map(f => f.properties.OBJECTID);
    console.log(ids)
    map.setFilter('highlighted', ['in', 'OBJECTID', ...ids]);
  

    // Mettre à jour l’interface DOM avec les noms des écoles
    const list = document.getElementById('list');
    list.innerHTML = '';
    intersecting.forEach(f => {
      const li = document.createElement('li');
      li.textContent = f.properties.Nom ? f.properties.Nom : f.properties.TYPO1;
      list.appendChild(li);
    });
  });
  
  // Curseur personnalisé
  map.on('mouseenter', 'pietonnes', function () {
    map.getCanvas().style.cursor = 'crosshair';
  });
  map.on('mouseleave', 'pietonnes', function () {
    map.getCanvas().style.cursor = '';
  });
  