import IRouting from '../types/IRouting';
import ISystem from '../types/ISystem';

const Routing = async (routingFilePath: string, system: ISystem): Promise<IRouting> => {
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

export default Routing;
