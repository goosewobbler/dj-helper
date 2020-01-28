import { Service } from '../../../src/common/types';

const createMockService = (body = '', headers = {}, statusCode = 200): Service => {
  const request = jest.fn().mockReturnValue(
    Promise.resolve({
      body,
      headers,
      statusCode,
    }),
  );

  const bump = jest.fn();
  const build = jest.fn();
  const clone = jest.fn();
  const create = jest.fn();
  const fetchDetails = jest.fn();
  const getComponentsData = jest.fn();
  const getComponentsSummaryData = jest.fn();
  const getDependantGraph = jest.fn();
  const link = jest.fn();
  const promote = jest.fn();
  const openInEditor = jest.fn();
  const reinstall = jest.fn();
  const getDependencyGraph = jest.fn();
  const setFavourite = jest.fn();
  const setUseCache = jest.fn();
  const start = jest.fn();
  const stop = jest.fn();
  const unlink = jest.fn();

  return {
    request,
    bump,
    build,
    clone,
    create,
    link,
    promote,
    openInEditor,
    setFavourite,
    getDependencyGraph,
    reinstall,
    fetchDetails,
    getComponentsData,
    getComponentsSummaryData,
    getDependantGraph,
    setUseCache,
    start,
    stop,
    unlink,
  };
};

export default createMockService;
