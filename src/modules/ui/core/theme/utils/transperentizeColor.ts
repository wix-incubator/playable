import hexToRgb from './hexToRgb';

function transperentizeColor(color: string, alpha: number) {
  const { r, g, b } = hexToRgb(color);
  return `rgba(${r},${g},${b},${alpha})`;
}

export default transperentizeColor;
