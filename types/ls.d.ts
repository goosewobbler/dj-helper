declare module 'ls' {
  export default function(directory: string): Array<{ name: string; full: string }>;
}
