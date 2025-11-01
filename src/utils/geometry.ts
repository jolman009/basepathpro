export function angleBetween(a: [number, number], b: [number, number]) {
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  return Math.atan2(dy, dx) * (180 / Math.PI);
}
