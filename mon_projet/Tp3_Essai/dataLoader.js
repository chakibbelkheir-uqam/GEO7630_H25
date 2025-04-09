import { map } from './map.js';

function getColorByScore(score) {
  return [
    '#d73027', '#fc8d59', '#fee08b', '#d9ef8b', '#91cf60', '#1a9850', '#006837'
  ][Math.max(0, Math.min(6, Math.floor(score) - 1))];
}

export function setupGeoJsonButton() {
  const btn = document.getElementById('loadGeoJson');
  let geoJsonData = null;
  let quartierLayer = null;

  btn.addEventListener('click', async () => {
    console.log("Bouton cliqué, chargement des données...");
    
    try {
      const res = await fetch('Quartier_MTL.json');
      geoJsonData = await res.json();
      
      console.log("Données chargées:", geoJsonData.features.length, "quartiers");
      
      // Assigner des scores depuis le GeoJSON
      geoJsonData.features.forEach(f => {
        f.properties.score = f.properties.score_pondéré || f.properties.score_pondere || 0;
      });
      
      // Détecter quel type de carte est utilisé
      if (typeof map.addSource === 'function' && typeof map.addLayer === 'function') {
        // Mapbox GL JS
        handleMapboxMap();
      } else if (typeof map.addGeoJSON === 'function' || typeof map.addLayer === 'function') {
        // Autre API similaire
        handleGenericMap();
      } else if (typeof map.setView === 'function' && typeof L !== 'undefined') {
        // Leaflet
        handleLeafletMap();
      } else {
        console.log("Type de carte non reconnu, tentative d'approche générique");
        handleGenericMap();
      }
      
    } catch (error) {
      console.error("Erreur lors du chargement:", error);
    }
  });

  // Fonction pour Mapbox GL JS
  function handleMapboxMap() {
    console.log("Utilisation de l'API Mapbox GL JS");
    
    if (!map.getSource('quartiers')) {
      map.addSource('quartiers', { 
        type: 'geojson', 
        data: geoJsonData 
      });

      map.addLayer({
        id: 'quartiers-layer',
        type: 'fill',
        source: 'quartiers',
        paint: {
          'fill-color': '#e0e0e0',  // Gris clair uniforme
          'fill-opacity': 0.6
        }
      });
      
      // Configurer les clics
      configureClickEvents();
    } else {
      map.getSource('quartiers').setData(geoJsonData);
    }
    
    setupUpdateFunction('mapbox');
  }
  
  // Fonction pour Leaflet
  function handleLeafletMap() {
    console.log("Utilisation de l'API Leaflet");
    
    // Supprimer la couche existante si présente
    if (quartierLayer && map.hasLayer(quartierLayer)) {
      map.removeLayer(quartierLayer);
    }
    
    // Créer une nouvelle couche
    quartierLayer = L.geoJSON(geoJsonData, {
      style: function(feature) {
        return {
          fillColor: '#e0e0e0',
          weight: 1,
          opacity: 1,
          color: '#666',
          fillOpacity: 0.6
        };
      },
      onEachFeature: function(feature, layer) {
        layer.on('click', function(e) {
          const props = feature.properties;
          document.getElementById('info').innerHTML = `
            <div class="info-panel">
              <strong>${props.NOM_OFFICIEL}</strong><br/>
              Score: ${props.SCORE_QUARTIER || 0}<br/>
              Police: ${props.nbr_poste_police || props.Nbr_poste_police || 0}<br/>
              Crimes: ${props.nbr_crimes || props.Nbr_crimes || 0}<br/>
              Pompiers: ${props.nbr_Caserne_pompier || props.Nbr_Caserne_pompier || 0}<br/>
              Hôpitaux: ${props.nbr_hopitaux || props.Nbr_hopitaux || 0}<br/>
              Collèges: ${props.nbr_college || props.Nbr_college || 0}<br/>
              Universités: ${props.nbr_universite || props.Nbr_université || 0}<br/>
              Commerces: ${props.nbr_resto_commerces || props.Nbr_resto_commerces || 0}<br/>
              STM: ${props.nbr_arret_stm || props.Nbr_Arret_STM || 0}<br/>
              Parcs: ${props.nbr_parc || props.Nbr_parc || 0}
            </div>
          `;
        });
      }
    }).addTo(map);
    
    // Sauvegarder la référence globalement pour y accéder plus tard
    window.quartierLayer = quartierLayer;
    
    setupUpdateFunction('leaflet');
  }
  
  // Fonction pour API générique ou inconnue
  function handleGenericMap() {
    console.log("Tentative d'utilisation d'une API générique");
    
    // Essayer d'ajouter le GeoJSON à la carte de la manière la plus générique
    try {
      if (typeof map.addData === 'function') {
        map.addData(geoJsonData);
      } else if (typeof map.addGeoJSON === 'function') {
        map.addGeoJSON(geoJsonData);
      } else if (typeof map.data === 'object' && typeof map.data.addGeoJson === 'function') {
        map.data.addGeoJson(geoJsonData);
      } else {
        console.error("Impossible d'ajouter des données GeoJSON à la carte");
      }
      
      setupUpdateFunction('generic');
    } catch (error) {
      console.error("Erreur lors de l'ajout des données GeoJSON:", error);
    }
  }
  
  // Configurer les événements de clic pour Mapbox
  function configureClickEvents() {
    map.on('click', 'quartiers-layer', (e) => {
      const props = e.features[0].properties;
      document.getElementById('info').innerHTML = `
        <div class="info-panel">
          <strong>${props.NOM_OFFICIEL}</strong><br/>
          Score: ${props.score || 0}<br/>
          Police: ${props.nbr_poste_police || props.Nbr_poste_police || 0}<br/>
          Crimes: ${props.nbr_crimes || props.Nbr_crimes || 0}<br/>
          Pompiers: ${props.nbr_Caserne_pompier || props.Nbr_Caserne_pompier || 0}<br/>
          Hôpitaux: ${props.nbr_hopitaux || props.Nbr_hopitaux || 0}<br/>
          Collèges: ${props.nbr_college || props.Nbr_college || 0}<br/>
          Universités: ${props.nbr_universite || props.Nbr_université || 0}<br/>
          Commerces: ${props.nbr_resto_commerces || props.Nbr_resto_commerces || 0}<br/>
          STM: ${props.nbr_arret_stm || props.Nbr_Arret_STM || 0}<br/>
          Parcs: ${props.nbr_parc || props.Nbr_parc || 0}
        </div>
      `;
    });
  }
  
  // Configurer la fonction de mise à jour
  function setupUpdateFunction(mapType) {
    window.updateScoreByCriteria = (criteres) => {
      console.log("updateScoreByCriteria appelé avec:", criteres);
      
      if (!criteres || criteres.length === 0) {
        console.log("Aucun critère sélectionné");
        return;
      }
      
      const isCrime = criteres.includes('crimes') || criteres.includes('crime');
      
      // Calculer les scores
      geoJsonData.features.forEach(feature => {
        let score = 0;
        criteres.forEach(c => {
          const possibleProps = [
            `nbr_${c}`, 
            `Nbr_${c}`, 
            c.toLowerCase(), 
            c
          ];
          
          for (const prop of possibleProps) {
            const val = parseFloat(feature.properties[prop]);
            if (!isNaN(val)) {
              score += val;
              break;
            }
          }
        });
        
        feature.properties.score = score;
      });
      
      // Définir les couleurs
      const getColor = (score) => {
        if (isCrime) {
          // Échelle rouge pour les crimes
          if (score === 0) return 'green';
          if (score < 5) return 'blue';
          if (score < 10) return 'yellow';
          if (score < 20) return 'pink';
          if (score < 30) return 'red';
          return '#a50f15';
        } else {
          // Échelle verte pour les infrastructures
          if (score === 0) return '#e0e0e0';
          if (score < 3) return '#edf8e9';
          if (score < 5) return '#bae4b3';
          if (score < 10) return '#74c476';
          if (score < 15) return '#31a354';
          return '#006d2c';
        }
      };
      
      // Mettre à jour selon le type de carte
      if (mapType === 'leaflet' && window.quartierLayer) {
        window.quartierLayer.eachLayer(function(layer) {
          const score = layer.feature.properties.score;
          layer.setStyle({
            fillColor: getColor(score)
          });
        });
      } else if (mapType === 'mapbox') {
        try {
          map.setPaintProperty('quartiers-layer', 'fill-color', [
            'match',
            ['floor', ['get', 'score']],
            0, '#e0e0e0',
            1, '#fee5d9',
            2, '#fcae91',
            3, '#fb6a4a',
            4, '#de2d26',
            5, '#a50f15',
            '#e0e0e0'
          ]);
          map.getSource('quartiers').setData(geoJsonData);
        } catch (error) {
          console.error("Erreur lors de la mise à jour Mapbox:", error);
        }
      } else if (mapType === 'generic') {
        console.log("Mise à jour pour carte générique non implémentée");
        // Implémentation spécifique nécessaire selon l'API
      }
    };
  }
}
// Cette fonction sera appelée quand les cases sont cochées
window.updateScoreByCriteria = (criteres) => {
  console.log("Critères sélectionnés:", criteres);
  
  if (!criteres || criteres.length === 0) {
    console.log("Aucun critère sélectionné");
    return;
  }
  
  // Pour chaque quartier, calculer un score combiné basé sur tous les critères cochés
  geoJsonData.features.forEach(feature => {
    let scoreTotal = 0;
    
    // Parcourir chaque critère sélectionné
    criteres.forEach(critere => {
      // Liste des variantes possibles pour les noms de propriétés
      const possibleProps = [
        `nbr_${critere}`, 
        `Nbr_${critere}`,
        `nbr_${critere.toLowerCase()}`, 
        `Nbr_${critere.toLowerCase()}`,
        `nbr_${critere.charAt(0).toUpperCase() + critere.slice(1)}`,
        `Nbr_${critere.charAt(0).toUpperCase() + critere.slice(1)}`,
        critere,
        critere.toLowerCase()
      ];
      
      // Chercher la première propriété qui existe avec une valeur numérique
      for (const prop of possibleProps) {
        if (prop in feature.properties) {
          const val = parseFloat(feature.properties[prop]);
          if (!isNaN(val)) {
            scoreTotal += val;
            console.log(`Quartier ${feature.properties.NOM_OFFICIEL}, critère ${critere}: +${val} (propriété: ${prop})`);
            break;
          }
        }
      }
    });
    
    // Mettre à jour le score combiné
    feature.properties.score = scoreTotal;
  });
  
  // Trouver le score maximum pour ajuster l'échelle de couleurs
  const maxScore = Math.max(...geoJsonData.features.map(f => f.properties.score));
  console.log("Score maximum trouvé:", maxScore);
  
  // Définir l'échelle de couleurs
  const colorScale = [
    { limit: 0, color: '#e0e0e0' },       // Gris clair
    { limit: maxScore * 0.2, color: '#c6dbef' },  // Bleu très clair
    { limit: maxScore * 0.4, color: '#9ecae1' },  // Bleu clair
    { limit: maxScore * 0.6, color: '#6baed6' },  // Bleu moyen
    { limit: maxScore * 0.8, color: '#3182bd' },  // Bleu
    { limit: maxScore, color: '#08519c' }         // Bleu foncé
  ];
  
  // Appliquer la coloration selon le type de carte
  if (window.quartierLayer) {
    // Approche Leaflet
    window.quartierLayer.eachLayer(function(layer) {
      const score = layer.feature.properties.score;
      let color = colorScale[0].color;
      
      for (let i = 1; i < colorScale.length; i++) {
        if (score > colorScale[i-1].limit && score <= colorScale[i].limit) {
          color = colorScale[i].color;
          break;
        }
      }
      
      layer.setStyle({
        fillColor: color,
        fillOpacity: 0.6
      });
    });
  } else {
    // Tentative générique
    try {
      // Si la source GeoJSON existe, la mettre à jour
      if (typeof map.getSource === 'function' && map.getSource('quartiers')) {
        map.getSource('quartiers').setData(geoJsonData);
      }
      
      // Essayer différentes façons de mettre à jour la carte
      if (typeof map.setPaintProperty === 'function') {
        // Mapbox GL JS
        map.setPaintProperty('quartiers-layer', 'fill-color', [
          'step', ['get', 'score'],
          colorScale[0].color,
          colorScale[1].limit, colorScale[1].color,
          colorScale[2].limit, colorScale[2].color,
          colorScale[3].limit, colorScale[3].color,
          colorScale[4].limit, colorScale[4].color,
          colorScale[5].limit, colorScale[5].color
        ]);
      } else if (typeof map.data === 'object' && typeof map.data.setStyle === 'function') {
        // Google Maps API
        map.data.setStyle(function(feature) {
          const score = feature.getProperty('score');
          let color = colorScale[0].color;
          
          for (let i = 1; i < colorScale.length; i++) {
            if (score > colorScale[i-1].limit && score <= colorScale[i].limit) {
              color = colorScale[i].color;
              break;
            }
          }
          
          return {
            fillColor: color,
            fillOpacity: 0.6,
            strokeWeight: 1
          };
        });
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la carte:", error);
    }
  }
  
  console.log("Mise à jour de la carte terminée");
};