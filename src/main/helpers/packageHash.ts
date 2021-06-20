import nodeObjectHash from 'node-object-hash';
import { Package } from '../../common/types';

const objectHash = nodeObjectHash({ sort: true });

const packageHash = (packageContents: Package): string => {
  const contentsSubset = {
    dependencies: packageContents.dependencies,
    devDependencies: packageContents.devDependencies,
    version: packageContents.version,
  };
  return objectHash.hash(contentsSubset);
};

export default packageHash;
