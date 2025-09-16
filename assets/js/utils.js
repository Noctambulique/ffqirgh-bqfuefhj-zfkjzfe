export const TAU = Math.PI * 2;

export function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

export function createImage(src) {
  const image = new Image();
  image.decoding = 'async';
  image.src = src;
  return image;
}
