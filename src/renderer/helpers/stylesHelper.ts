import { useState, useEffect } from 'react';
import resolveConfig from 'tailwindcss/resolveConfig';
import tailwindConfig from '../../../tailwindcss/tailwind.config';

const styles = resolveConfig(tailwindConfig);

const tailwindColorResolver = (colorVariable: string): string => {
  const tailwindRule = styles?.theme?.colors[colorVariable]?.default;

  if (!tailwindRule) {
    return '';
  }

  return tailwindRule.replace(/var\(([^)]+)\)/, (fullMatch: string, cssVar: string) => {
    if (typeof window === 'undefined') {
      return '';
    }
    return window.getComputedStyle(document.documentElement).getPropertyValue(cssVar).trim();
  });
};

const useTailwindColorResolver = (colorVariable: string): string => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // equivalent to componentDidMount
    setIsClient(true);
  }, []);

  if (!isClient) {
    return 'rgb(255, 255, 255)';
  }

  return tailwindColorResolver(colorVariable);
};

export { useTailwindColorResolver };
