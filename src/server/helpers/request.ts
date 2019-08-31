import renderChas from 'chas';

import { Config } from '../app/config';
import { State } from '../app/state';
import { ComponentType, ComponentState, System, Response } from '../../common/types';

const requestWithRetries = async (
  system: System,
  name: string,
  type: ComponentType,
  port: number,
  propsString: string,
  log: (message: string) => void,
  retries: number,
): Promise<Response> => {
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
    (body.startsWith('Template had dependencies that required success but were not successful') ||
      body.startsWith('Template has these missing dependencies') ||
      body.indexOf('ECONNREFUSED') !== -1)
  ) {
    const reason = body.split('\n')[0];
    const remainingRetries = retries - 1;
    log(
      `Trying again because: ${reason} (${remainingRetries} ${
        remainingRetries === 1 ? 'retry' : 'retries'
      } remaining).`,
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

const getNewHistory = (currentHistory: string[], newEntry: string): string[] => {
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
  system: System,
  config: Config,
  state: State,
  name: string,
  componentPath: string,
  currentState: ComponentState,
  type: ComponentType,
  port: number,
  props: { [Key: string]: string },
  log: (message: string) => void,
  history: boolean,
): Promise<Response> => {
  if (currentState !== ComponentState.Running) {
    throw new Error('Component is not running');
  }

  const nonVersionProps = Object.keys(props).filter((propName): boolean => propName !== 'version');

  const propsString = nonVersionProps.reduce(
    (acc, propName): string =>
      `${acc}/${encodeURIComponent(propName)}/${encodeURIComponent(nonVersionProps[parseInt(propName)])}`,
    '',
  );

  if (history) {
    const stateKey = `history.${name}`;
    const currentHistory = (state.retrieve(stateKey) || []) as string[];
    const newEntry = type === ComponentType.Page ? props.path || '' : propsString;
    await state.store(stateKey, getNewHistory(currentHistory, newEntry));
  }

  if (config.getValue('renderer') === 'chas') {
    const chasType = type === ComponentType.View ? 'view' : 'data';
    const response = await renderChas(componentPath, chasType, props);
    return {
      body: JSON.stringify(response.body),
      headers: { 'Content-Type': 'application/json' },
      statusCode: response.code,
    };
  }

  const retries = (config.getValue('retries') || 10) as number;
  return requestWithRetries(system, name, type, port, propsString, log, retries);
};

export default request;
