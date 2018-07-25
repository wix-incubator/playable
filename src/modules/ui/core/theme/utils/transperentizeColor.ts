import hexToRgb from './hexToRgb';

function transperentizeColor(color: string, alpha: number = 1) {
  const { r, g, b } = hexToRgb(color);
  return `rgba(${r},${g},${b},${alpha})`;
}

export default transperentizeColor;
