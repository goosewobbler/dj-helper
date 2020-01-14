// @ts-ignore
import resolveConfig from 'tailwindcss/resolveConfig';
// @ts-ignore
import tailwindConfig from '../../../tailwind.config';

const styles = resolveConfig(tailwindConfig);

const tailwindColorResolver = (colorVariable: string): string => {
  const tailwindRule = styles?.theme?.colors[colorVariable]?.default;

  if (!tailwindRule) {
    return '';
  }

  return tailwindRule.replace(/var\(([^)]+)\)/, (fullMatch: string, cssVar: string) => {
    if (typeof window === 'undefined') {
      return '0,0,0';
    }
    return window
      .getComputedStyle(document.documentElement)
      .getPropertyValue(cssVar)
      .trim();
  });
};

export { tailwindColorResolver };
