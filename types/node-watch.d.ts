declare module 'node-watch' {
  export default function (
    directory: string,
    options: {
      filter?: (name: string) => boolean;
      recursive?: boolean;
    },
    callback: (event: string, fileName: string) => void,
  ): void;
}
