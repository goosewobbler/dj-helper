const socketIoLibraryScript = (apiPort: number): string =>
  `<script src="http://localhost:${apiPort}/socket.io/socket.io.js"></script>`;
const socketIoPageReloadScript = (apiPort: number): string =>
  `<script>const socket = io("http://localhost:${apiPort}"); socket.on("reload", () => window.location.reload(true));</script>`;

export { socketIoLibraryScript, socketIoPageReloadScript };
