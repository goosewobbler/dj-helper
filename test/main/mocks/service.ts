import Config from '../../../src/server/app/Config';
import State from '../../../src/server/app/State';
import Service from '../../../src/server/service/Service';
import ISystem from '../../../src/server/types/ISystem';
import createDefaultMockSystem from './defaultSystem';

const createMockService = async (
  options: { componentsDirectory?: string; systemModifier?: (builder: any) => void } = {},
) => {
  const routingFilePath = '/tmp/routing.json';

  const componentsDirectory = options.componentsDirectory || '/test/components';
  const { systemBuilder } = createDefaultMockSystem(componentsDirectory);
  if (options.systemModifier) {
    options.systemModifier(systemBuilder);
  }
  const system: ISystem = systemBuilder.build();
  const config = await Config('/mdc-config.json', system);
  const state = await State('/mdc-state.json', system);

  const onComponentUpdate = jest.fn();
  const onReload = jest.fn();
  const startServer = jest.fn();

  const service = await Service(system, config, state, onComponentUpdate, onReload, startServer, {
    componentsDirectory,
    routingFilePath,
  });

  return { service, onComponentUpdate, onReload, startServer, system, systemBuilder, config, state };
};

export default createMockService;
