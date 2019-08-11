import { System } from '../system';

interface Routing {
  updateRoute(componentName: string, port: number): Promise<void>;
}

const createRouting = async (routingFilePath: string, system: System): Promise<Routing> => {
  const routes: { [Key: string]: number } = {};

  const write = (): Promise<void> => system.file.writeFile(routingFilePath, JSON.stringify(routes, null, 2));

  const updateRoute = async (componentName: string, port: number): Promise<void> => {
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

export { createRouting, Routing };
