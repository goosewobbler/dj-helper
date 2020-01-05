/* eslint-disable no-console */
window.define('live-push', [], () => {
  const intervals = {};
  const onMomentCallbacks = [];
  const consoleAvailable = !!window.console && !window.jasmine;
  const exports = {};

  function logSubscriptions() {
    console.info('Morph Live Push Local: subscriptions:', Object.keys(intervals));
  }

  function callbackAllOnMomentCallbacks(moment) {
    onMomentCallbacks.forEach(callback => {
      callback(moment);
    });
  }

  function fetch(topic, callbackWhen202, callback) {
    let url = `http://localhost:4000/proxy${topic.substring(12)}`;

    if (topic.indexOf('nitro://') > -1) {
      url = `http://open.test.bbci.co.uk/live-broker/moments?request=${encodeURIComponent(topic)}`;
    }

    const xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.onreadystatechange = () => {
      let responseBody;
      if (xhr.readyState === 4) {
        const responseCode = xhr.status;
        if (responseCode === 200) {
          responseBody = xhr.responseText;
          if (topic.indexOf('nitro://') > -1) {
            // The LiveBroker returns a different format to Morph, so just return the raw moments
            responseBody = JSON.parse(xhr.responseText).moments;
          }
          callback({
            topic,
            payload: responseBody,
          });
        } else if (consoleAvailable) {
          console.warn('Morph Live Push Local: response code:', responseCode, 'for:', url);
          if (responseCode === 202 && callbackWhen202) {
            callback();
          }
        }
      }
    };
    xhr.send(null);
  }

  exports.subscribe = topic => {
    if (intervals[topic]) {
      return;
    }

    const poll = fetch.bind(this, topic, false, callbackAllOnMomentCallbacks);
    intervals[topic] = setInterval(poll, POLL_INTERVAL_FROM_CONFIG);
    poll();

    if (consoleAvailable) {
      console.info('Morph Live Push Local: subscribed to:', topic);
      logSubscriptions();
    }
  };

  exports.unsubscribe = topic => {
    if (intervals[topic]) {
      clearInterval(intervals[topic]);
      delete intervals[topic];
      if (consoleAvailable) {
        console.info('Morph Live Push Local: unsubscribed from:', topic);
        logSubscriptions();
      }
    }
  };

  exports.start = () => {};

  exports.get = (topic, count, callback) => {
    if (consoleAvailable) {
      console.info('Morph Live Push Local: get (XHR):', topic);
    }

    fetch(topic, true, moment => {
      const moments = moment ? [moment] : [];
      callback(JSON.stringify({ moments }));
    });
  };

  exports.on = (channel, callback) => {
    onMomentCallbacks.push(callback);
  };

  exports.getInstance = () => {
    if (consoleAvailable) {
      console.info('Morph Live Push Local: getting instance...');
    }
    return exports;
  };

  return exports;
});
