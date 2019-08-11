import { Config } from '../app/config';
import getDefaultTypeOverride from './defaultTypeOverrides';
import { ComponentType, Package } from '../../common/types';

const getComponentType = (config: Config, packageContents: Package, name: string): number => {
  const typeOverride = getDefaultTypeOverride(name) || config.getValue(`typeOverrides.${name}`);
  if (typeOverride) {
    switch (typeOverride) {
      case 'data':
        return ComponentType.Data;
      case 'view':
        return ComponentType.View;
      default:
        return ComponentType.Page;
    }
  }

  const packageDependencies = packageContents.dependencies || {};
  if (packageDependencies['bbc-morph-page-assembler']) {
    return ComponentType.Page;
  }
  if (packageDependencies.react) {
    return ComponentType.View;
  }
  return ComponentType.Data;
};

export default getComponentType;
