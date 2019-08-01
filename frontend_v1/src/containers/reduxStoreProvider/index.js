let reduxStore;

export function setReduxStore(store) {
  reduxStore = store;
}

export function getStore() {
  return reduxStore;
}