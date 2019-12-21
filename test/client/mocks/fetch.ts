const mockFetch = (responses: { [Key: string]: any } = {}) => {
  const calls: string[] = [];
  const callsWithOptions: Array<{ url: string; options: any }> = [];

  const mockedFetch: any = (url: string, options: any) => {
    calls.push(url);
    callsWithOptions.push({ url, options });
    if (url in responses) {
      return Promise.resolve({
        json: (): any => Promise.resolve(responses[url] || {}),
      });
    }
  };

  window.fetch = mockedFetch;

  const getCalls = () => calls;

  const getCallsWithOptions = () => callsWithOptions;

  return {
    getCalls,
    getCallsWithOptions,
  };
};

export default mockFetch;
