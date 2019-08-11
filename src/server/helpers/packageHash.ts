import * as hash from 'node-object-hash';
import { Package } from '../../common/types';

const hasher = hash({ sort: true }).hash;

const packageHash = (packageContents: Package): string => {
  const contentsSubset = {
    dependencies: packageContents.dependencies,
    devDependencies: packageContents.devDependencies,
    version: packageContents.version,
  };
  return hasher(contentsSubset);
};

export default packageHash;
