import fs from 'fs-extra';
import appRoot from 'app-root-path';

const getRouting = () => {
  let routing;
  try {
    routing = JSON.parse(fs.readFileSync(`${appRoot}/.routing.json`));
  } catch (ex) {
    routing = {};
  }
  return routing;
};

export default getRouting;
