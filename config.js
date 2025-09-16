export const CONFIG = Object.freeze({
  world: { width: 960, height: 600 },
  center: { x: 480, y: 300 },
  circleRadius: 180,
  houseCount: 7,
  house: { size: 130 },
  player: {
    size: 32,
    color: '#ffd166',
    outline: 'rgba(0,0,0,.45)',
    speed: 2.6,
    start: { x: 480, y: 300 },
    image: 'http://www.image-heberg.fr/files/17570217122216427613.png',
  },
  links: {
    map: {
      1: 'http://www.image-heberg.fr/files/17570045253321247512.png',
      2: 'ampleFolder/Film Art Jeu.pdf',
      3: 'ampleFolder/Lubies.pdf',
      4: 'ampleFolder/Power Point Ultime +.pdf',
      5: 'map3.html',
      6: 'ampleFolder/Bio Croisé Octavie Basile.pdf',
      7: 'map2.html',
    },
  },
  names: {
    1: 'Agence de Voyage',
    2: 'Centre Culturel',
    3: 'Centre des Lubies',
    4: 'Maison du Détective',
    5: 'Ordre des bibliothécaires',
    6: 'Musée des Domus',
    7: 'Centre des Archives',
  },
});

export const HOUSE_IMAGES = [
  'House/20250822_1811_Agence Voyage Nocturne_simple_compose_01k398q5qaf59b1d684d8tr2vr-Photoroom.png',
  'House/20250909_1935_Centre Culturel Nocturne_simple_compose_01k4qrpxm6epeadq2gexry06a0-Photoroom.png',
  'House/20250909_1938_Centre des Lubies Nocturne_simple_compose_01k4qrtxbwf2v8jnw0wex32px9-Photoroom.png',
  'House/Immeuble_Bibliotheque-Photoroom.png',
  'House/20250909_1948_Bibliothèque Éclairée Nocturne_simple_compose_01k4qsdqwmej0vaswh1fnbzmt8 (1)-Photoroom.png',
  'House/20250821_1840_Musée Éclairé la Nuit_simple_compose_01k36qyzzbfcq90cqn3vpsgaj9-Photoroom.png',
  "House/20250822_1305_Centre d'archives nocturne_simple_compose_01k38q6wp3endsa7d41y0w1wke-Photoroom.png",
];

export const BACKGROUND_SRC = 'http://www.image-heberg.fr/files/17570213431743313302.png';
