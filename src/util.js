// const runtime = chrome ? chrome.runtime : browser.runtime;
// const browserTabs = chrome ? chrome.tabs : browser.tabs;
// const extensionStorage = chrome ? chrome.storage.local : browser.storage.local;

// export const isExtension = chrome.storage || browser.storage;

// export const getValueInStore = (key) => {
//   return new Promise((resolve, reject) => {
//     extensionStorage.get([key], (result) => {
//       resolve(result);
//     });
//   });
// };

export const messageToBackground = async (message) => {
  await chrome.runtime?.sendMessage(message);
};

const queryText = /iamlazy/ig;
const isIframe = window.self !== window.top;

export const messageToContentScript = async (message) => {
  await chrome?.tabs?.query({}, (tabs) => {
    tabs?.forEach((tab) => {
      chrome?.tabs?.sendMessage(tab.id, message);
    });
  });
};

export const rerenderPassiveTabUI = () => {
  messageToContentScript({
    message: 'please rerender',
  });
};

export const getDomainAndSubDomain = (link) => {
  const a = document.createElement('a');
  a.href = link;

  // Fallback to main page in domain if there is no query
  const homepage = `${a.protocol}//${a.host}`;

  return {
    domain: a.host,
    homepage,
  };
};

export const createURL = (query, baseURL) => {
  if(!query) {
    const { homepage } = getDomainAndSubDomain(baseURL);
    return homepage;
  }

  return baseURL.replace(queryText, query);
};

export const createTestURL = (baseURL) => {
  return createURL('test', baseURL);
};

export const storageGet = async (key, injected) => {
  if(chrome.runtime?.id) {
    const getValueInStore = (key) => {
      return new Promise((resolve, reject) => {
        chrome.storage.local.get([key], (result) => {
          resolve(result);
        });
      });
    };

    const result = await getValueInStore(key);

    return result[key];
  }

  const result = !isIframe ? JSON.parse(localStorage.getItem(key)) : null;

  return result;
};

export const storageSet = async (key, value) => {
  if(chrome.runtime?.id) {
    const setValueInStore = async (values, callback = () => {}) => {
      await chrome.storage.local.set(values);
      callback();
    };

    setValueInStore({
      [key]: value,
    });
  }else{
    !isIframe && localStorage.setItem(key, JSON.stringify(value));
  }

  // If storage changed then rerender ui on passive tab
  rerenderPassiveTabUI();
};

export const createOptions = (options, labelKey, valueKey) => {
  const reactSelectOptions = options.map((item) => {
    return {
      value: item[valueKey],
      label: item[labelKey],
    };
  });

  // Sort base on label alphabetically
  const sorted = reactSelectOptions.sort((a, b) => {
    return a.label.localeCompare(b.label);
  });

  return sorted;
};
