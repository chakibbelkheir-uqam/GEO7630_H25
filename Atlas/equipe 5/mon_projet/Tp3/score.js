// === score.js ===
// Calcule un score de 1 à 7 selon les critères cochés
export function calculateScore(feature, criteria) {
  if (!criteria.length) return 1;
  let count = 0;
  criteria.forEach(key => {
    const val = parseFloat(feature.properties[key]) || 0;
    if (key === 'Nbr_crimes') {
      if (val > 0) count -= 1;      // crime baisse le score
    } else {
      if (val > 0) count += 1;      // autres critères augmentent le score
    }
  });
  // Normaliser entre 1 et 7
  const raw = (count / criteria.length) * 6 + 1;
  return Math.round(Math.max(1, Math.min(7, raw)));
}

// Palette 1=rouge → 7=vert
export function getColor(score) {
  return {
    1: '#ff0000',
    2: '#ff6600',
    3: '#ffcc00',
    4: '#ccff33',
    5: '#99ff66',
    6: '#66ff99',
    7: '#00ff00'
  }[score] || '#888';
}
