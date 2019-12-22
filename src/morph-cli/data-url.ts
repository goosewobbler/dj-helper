import path from 'path';
import morphRequestPaths from 'morph-cli/lib/morph-request-paths';
import getRouting from './get-routing';
import getConfig from './get-config';

const buildUrlForDataProxy = (currentDep, props, currentModulePath, workspaceRoot, contextId) => {
  const routing = getRouting();
  const directory = path.basename(process.cwd());
  const componentName = `bbc-morph-${directory}`;

  let url = 'http://localhost:';

  if (routing[currentDep.uri.data]) {
    const { componentPort } = getConfig();
    url += componentPort;
  } else if (routing[componentName]) {
    url += routing[componentName];
  } else {
    return null;
  }

  if (workspaceRoot) {
    url += morphRequestPaths.pathForTemplateDependency(currentDep, props, currentModulePath);
  } else {
    url += morphRequestPaths.pathForDataRequest(currentDep, props);
  }

  if (contextId) {
    url += `?contextId=${contextId}`;
  }

  return url;
};

export default buildUrlForDataProxy;
