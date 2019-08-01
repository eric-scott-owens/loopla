import forEach from 'lodash/forEach';


/**
 * Helper to get the users auth token from either redux or the data store
 * @param {*} storeOrStoreStorageService - Either a redux store object or a StoreStorageService instance
 */
async function getUsersAuthTokenHeaderValueAsync(storeOrStoreStorageService) {
  const isReduxStore = (storeOrStoreStorageService && storeOrStoreStorageService.getState);
  const isStoreStorageService = (storeOrStoreStorageService && storeOrStoreStorageService.tokens && storeOrStoreStorageService.tokens.getAllAsync);
  let authToken;

  if(isReduxStore) {
    const state = storeOrStoreStorageService.getState();
    authToken = state.user.authToken || '';
  }
  
  if(isStoreStorageService) {
    const tokens = await storeOrStoreStorageService.tokens.getAllAsync();
    authToken = tokens.length === 1 ? tokens[0].token : '';
  }

  return `Token ${authToken}`;
}

/**
 * Prepares headers parameters for use in web requests by including auth headers
 * @param {*} params 
 * @param {*} storeOrStoreStorageService 
 */
export default async function prepFetchParamsAsync(params, storeOrStoreStorageService) {
  // Compile final params
  // Add Token to headers
  const headers = new Headers();
  const authTokenHeaderValue = await getUsersAuthTokenHeaderValueAsync(storeOrStoreStorageService)
  headers.set('Authorization', authTokenHeaderValue);

  // Add any plain text headers to the headers object
  const providedHeaders = params.headers || {};
  const providedHeaderKeys = Object.keys(providedHeaders);
  forEach(providedHeaderKeys, key => {
    headers.set(key, providedHeaders[key]);
  })

  const fetchParams = Object.assign({}, params, { headers, mode: 'cors' });
  return fetchParams;
}
  
