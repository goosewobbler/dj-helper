import Routing from '../types/Routing';
import System from '../types/System';

const createRouting = async (routingFilePath: string, system: System): Promise<Routing> => {
  const routes: { [Key: string]: number } = {};

  const write = () => system.file.writeFile(routingFilePath, JSON.stringify(routes, null, 2));

  const updateRoute = async (componentName: string, port: number) => {
    if (port === null) {
      delete routes[componentName];
    } else {
      routes[componentName] = port;
    }
    await write();
  };

  await write();

  return {
    updateRoute,
  };
};

export default createRouting;
