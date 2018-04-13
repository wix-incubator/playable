const SHORTHAND_HEX_COLOR_PATTERN = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
const HEX_COLOR_PATTERN = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i;

type IRGB = {
  r: number;
  g: number;
  b: number;
};

function hexToRgb(hex: string): IRGB {
  hex = hex.replace(
    SHORTHAND_HEX_COLOR_PATTERN,
    (_, r, g, b) => r + r + g + g + b + b,
  );

  const result = hex.match(HEX_COLOR_PATTERN);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

export default hexToRgb;
