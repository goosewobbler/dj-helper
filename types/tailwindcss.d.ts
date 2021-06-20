declare module 'tailwindcss/resolveConfig' {
  export default function (
    tailwindConfig: Record<string, unknown>,
  ): { theme: { colors: { [Key: string]: { default: string } } } };
}
