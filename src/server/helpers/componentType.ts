import { Config } from '../app/config';
import { getDefaultTypeOverride } from './defaultTypeOverrides';
import { ComponentType } from '../service/component';

const getComponentType = (config: Config, packageContents: any, name: string) => {
  const typeOverride = getDefaultTypeOverride(name) || config.getValue(`typeOverrides.${name}`);
  if (typeOverride) {
    switch (typeOverride) {
      case 'data':
        return ComponentType.Data;
      case 'view':
        return ComponentType.View;
      case 'page':
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

export { getComponentType };
