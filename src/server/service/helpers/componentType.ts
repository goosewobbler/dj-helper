import IConfig from '../../types/IConfig';
import getDefaultTypeOverride from '../DefaultTypeOverrides';
import ComponentType from '../types/ComponentType';

const getComponentType = (config: IConfig, packageContents: any, name: string) => {
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
  } else if (packageDependencies.react) {
    return ComponentType.View;
  }
  return ComponentType.Data;
};

export default getComponentType;
