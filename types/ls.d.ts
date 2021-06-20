declare module 'ls' {
  export default function (directory: string): { name: string; full: string }[];
}
