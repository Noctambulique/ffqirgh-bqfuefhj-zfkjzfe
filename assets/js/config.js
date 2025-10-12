export const CONFIG = Object.freeze({
  world: { width: 960, height: 600 },
  center: { x: 480, y: 300 },
  circleRadius: 150,
  houseCount: 5,
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
      4: 'map2.html',
      5: 'map3.html',
    },
  },
  names: {
    1: 'Médiathèques',
    2: 'Centre des Lubies',
    3: 'Bureau du Détective',
    4: 'QG de Philosophie',
    5: 'Hotel des Libraires',
  },
});

export const HOUSE_IMAGES = [
  'House/Médiathèque.png',
  'House/CentredesLubies.png',
  'House/BureauDuDetective.png',
  'House/QGPhilosophe.png',
  "House/HoteldesLibraires.png",
];

export const BACKGROUND_SRC = 'http://www.image-heberg.fr/files/17570213431743313302.png';


















