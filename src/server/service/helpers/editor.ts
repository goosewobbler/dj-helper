import ISystem from '../../types/ISystem';

const openInEditor = async (system: ISystem, componentPath: string) => {
  const wslPathIdentifier = '/mnt/c/';

  // If the path to the morph module directory starts /mnt/c/, we assume we're on Windows Subsystem for Linux
  // VSCode will be opened natively, so we need to strip /mnt/c from the start of the path for code to open it correctly
  const openComponentPath = componentPath.startsWith(wslPathIdentifier)
    ? `/${componentPath.substring(wslPathIdentifier.length)}`
    : componentPath;

  await system.process.runToCompletion(
    await system.process.getCurrentWorkingDirectory(),
    `code ${openComponentPath}`,
    () => null,
    () => null,
  );
};

export default openInEditor;
