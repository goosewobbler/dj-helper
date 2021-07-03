const log = (...args: unknown[]): void => {
  console.log(...args); // eslint-disable-line no-console
};

const logWarning = (message: string): void => {
  console.warn(message); // eslint-disable-line no-console
};

const logInfo = (message: string): void => {
  console.info(message); // eslint-disable-line no-console
};

const logError = (error: Error | string): void => {
  const { stack, message } = error as Error;
  const errorMessage = message || error;
  if (stack) {
    console.error(stack); // eslint-disable-line no-console
  }
  console.error(errorMessage); // eslint-disable-line no-console
};

export { log, logError, logInfo, logWarning };
