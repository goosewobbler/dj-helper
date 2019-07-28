import getRouting from './get-routing';

const buildUrlForViewProxy = uriObject => {
  const viewPath = uriObject.path;
  const routing = getRouting();

  const componentToRoute = Object.keys(routing).filter(componentName =>
    new RegExp(`/${componentName}(?:/|$)`).test(viewPath),
  ).length;

  if (!componentToRoute) {
    return null;
  }

  return `http://localhost:4000${viewPath.replace('/view/', '/proxy/')}`;
};

export default buildUrlForViewProxy;
