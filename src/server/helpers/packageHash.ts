import * as hash from 'node-object-hash';

const hasher = hash({ sort: true }).hash;

const packageHash = (packageContents: any) => {
  const contentsSubset = {
    dependencies: packageContents.dependencies,
    devDependencies: packageContents.devDependencies,
    version: packageContents.version,
  };
  return hasher(contentsSubset);
};

export { packageHash };
