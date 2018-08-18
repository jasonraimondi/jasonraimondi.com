import colors from './colors';
import screens from './screens';
import typography from './typography';

export const properties = {
  ...screens,
  ...typography,
  ...colors,
};

export const mediaQueries = {
  smallOnly: `screen and (max-width: ${screens.sm})`,
  medium: `screen and (min-width: ${addPx(screens.sm, 1)})`,
  mediumOnly: `screen and (min-width: ${addPx(screens.sm, 1)}) and (max-width: ${screens.md})`,
  large: `screen and (min-width: ${addPx(screens.md, 1)})`,
  largeOnly: `screen and (min-width: ${addPx(screens.md, 1)}) and (max-width: ${screens.lg})`,
  xlarge: `screen and (min-width: ${addPx(screens.lg, 1)})`,
  xlargeOnly: `screen and (min-width: ${addPx(screens.lg, 1)}) and (max-width: ${screens.xl})`,
  xxlarge: `screen and (min-width: ${addPx(screens.xl, 1)})`,
};

function addPx(a: string, b: number) {
  let num = Number(a.replace('px', ''));
  num += b;
  return num + 'px';
}
