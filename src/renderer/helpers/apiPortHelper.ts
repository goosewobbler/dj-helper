let apiPort = 4444;

const getApiPort = (): number => apiPort;

const setApiPort = (port: number): void => {
  apiPort = port;
};

export { getApiPort, setApiPort };
