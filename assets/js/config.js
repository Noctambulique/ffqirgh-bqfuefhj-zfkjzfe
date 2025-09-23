export const CONFIG = Object.freeze({
  world: { width: 960, height: 600 },
  center: { x: 480, y: 300 },
  circleRadius: 180,
  houseCount: 6,
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
      1: 'ampleFolder/Film Art Jeu.pdf',
      2: 'ampleFolder/Lubies.pdf',
      3: 'ampleFolder/Power Point Ultime +.pdf',
      4: 'ampleFolder/Dictionnaire.pdf',
      5: 'map2.html',
      6: 'map3.html',
    },
  },
  names: {
    1: 'Médiathèques',
    2: 'Centre des Lubies',
    3: 'Bureau du Détective',
    4: 'Musée des Songes',
    5: 'QG de Philosophie',
    6: 'Hotel des Libraires',
  },
});

export const HOUSE_IMAGES = [
  'House/Médiathèque.png',
  'House/CentredesLubies.png',
  'House/BureauDuDetective.png',
  'House/MuséeDesSonges.png',
  'House/QGPhilosophe.png',
  "House/HoteldesLibraires.png",
];

export const BACKGROUND_SRC = 'http://www.image-heberg.fr/files/17570213431743313302.png';











