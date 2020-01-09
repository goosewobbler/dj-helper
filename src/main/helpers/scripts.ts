const socketIoLibraryScript = (componentPort: number): string =>
  `<script src="http://localhost:${componentPort}/socket.io/socket.io.js"></script>`;
const socketIoPageReloadScript = (componentPort: number): string =>
  `<script>const socket = io("http://localhost:${componentPort}"); socket.on("reload", () => window.location.reload(true));</script>`;

export { socketIoLibraryScript, socketIoPageReloadScript };
