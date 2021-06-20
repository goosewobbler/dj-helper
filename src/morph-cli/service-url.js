import getRouting from './get-routing';
import getConfig from './get-config';

const buildUrlForViewProxy = (uriObject) => {
  const viewPath = uriObject.path;
  const routing = getRouting();

  const componentToRoute = Object.keys(routing).filter((componentName) =>
    new RegExp(`/${componentName}(?:/|$)`).test(viewPath),
  ).length;

  if (!componentToRoute) {
    return null;
  }

  const { componentPort } = getConfig();

  return `http://localhost:${componentPort}${viewPath.replace('/view/', '/proxy/')}`;
};

export default buildUrlForViewProxy;
