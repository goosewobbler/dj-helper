import { System, Store } from '../../common/types';

const openInEditor = async (system: System, config: Store, componentPath: string): Promise<void> => {
  const wslPathIdentifier = '/mnt/c/';

  // If the path to the morph module directory starts /mnt/c/, we assume we're on Windows Subsystem for Linux
  // VSCode will be opened natively, so we need to strip /mnt/c from the start of the path for code to open it correctly
  const openComponentPath = componentPath.startsWith(wslPathIdentifier)
    ? `/${componentPath.substring(wslPathIdentifier.length)}`
    : componentPath;

  const addToWorkspace = config.get('addToVSCodeWorkspace');

  await system.process.runToCompletion(
    await system.process.getCurrentWorkingDirectory(),
    `code${addToWorkspace ? ' --add' : ''} ${openComponentPath}`,
    (): null => null,
    (): null => null,
  );
};

export default openInEditor;
