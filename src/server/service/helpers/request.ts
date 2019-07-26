import { startsWith } from 'lodash/fp';

import ComponentState from '../../../types/ComponentState';
import IConfig from '../../types/IConfig';
import IState from '../../types/IState';
import ISystem from '../../types/ISystem';
import ComponentType from '../types/ComponentType';

const requestWithRetries = async (
  system: ISystem,
  name: string,
  type: ComponentType,
  port: number,
  propsString: string,
  log: (message: string) => void,
  retries: number,
): Promise<{
  body: string;
  headers: {
    [Key: string]: string;
  };
  statusCode: number;
}> => {
  const requestType = type === ComponentType.Page || type === ComponentType.Data ? 'data' : 'view';

  const requestUrl = `http://localhost:${port}/${requestType}/${name}${propsString}`;
  log(`Requesting ${requestUrl}`);

  const response = await system.network.get(requestUrl);

  if (!response) {
    return { body: '', headers: {}, statusCode: 404 };
  }

  const { body, headers, statusCode } = response;

  if (
    retries > 0 &&
    (startsWith('Template had dependencies that required success but were not successful', body) ||
      startsWith('Template has these missing dependencies', body) ||
      body.indexOf('ECONNREFUSED') !== -1)
  ) {
    const reason = body.split('\n')[0];
    const remainingRetries = retries - 1;
    log(
      `Trying again because: ${reason} (${remainingRetries} ${remainingRetries === 1
        ? 'retry'
        : 'retries'} remaining).`,
    );
    return requestWithRetries(system, name, type, port, propsString, log, remainingRetries);
  }

  const modifiedBody = body
    .replace(/localhost:8082/g, `localhost:${port}`)
    .replace(/react\.min/g, 'react')
    .replace(/react-dom\.min/g, 'react-dom')
    .replace(/'live-push' : '[^']+'/g, "'live-push' : '//localhost:3333/local-push'");

  return { body: modifiedBody, headers, statusCode };
};

const getNewHistory = (currentHistory: string[], newEntry: string) => {
  const currentHistoryWithoutNewEntry = [...currentHistory];
  const indexOfNewEntry = currentHistoryWithoutNewEntry.indexOf(newEntry);
  if (indexOfNewEntry !== -1) {
    currentHistoryWithoutNewEntry.splice(indexOfNewEntry, 1);
  }
  const newHistory = [newEntry, ...currentHistoryWithoutNewEntry];
  if (newHistory.length > 10) {
    return newHistory.slice(0, 10);
  }
  return newHistory;
};

const request = async (
  system: ISystem,
  config: IConfig,
  state: IState,
  name: string,
  currentState: ComponentState,
  type: ComponentType,
  port: number,
  props: { [Key: string]: string },
  log: (message: string) => void,
  history: boolean,
) => {
  if (currentState !== ComponentState.Running) {
    throw new Error('Component is not running');
  }

  const { version, ...nonVersionProps } = props;

  const propsString = Object.keys(nonVersionProps).reduce(
    (acc, propName) => `${acc}/${encodeURIComponent(propName)}/${encodeURIComponent(nonVersionProps[propName])}`,
    '',
  );

  if (history) {
    const stateKey = `history.${name}`;
    const currentHistory = state.retrieve(stateKey) || [];
    const newEntry = type === ComponentType.Page ? props.path || '' : propsString;
    await state.store(stateKey, getNewHistory(currentHistory, newEntry));
  }

  const retries = config.getValue('retries') || 10;
  return requestWithRetries(system, name, type, port, propsString, log, retries);
};

export default request;
