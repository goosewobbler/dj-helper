const DefaultTypeOverrides: { [Key: string]: string } = {
  'bbc-morph-sport-media-asset-data': 'data',
};

const getDefaultTypeOverride = (name: string): string => DefaultTypeOverrides[name];

export default getDefaultTypeOverride;
