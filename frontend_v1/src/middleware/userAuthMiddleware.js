
import * as actions from '../containers/auth/actions';

/**
 * Handles action request to load auth from storage
 * @param {ReduxStore} store 
 * @param {StoreStorageService} storeStorageService 
 */
function handleLoadFromStorageAction(store, storeStorageService) {
  store.dispatch(actions.loadFromStoragePending());
  const loadPromise = storeStorageService.tokens.getAllAsync();
  loadPromise.then(tokens => {
      if(tokens && tokens.length === 1) {
        store.dispatch(actions.loadFromStorageComplete(tokens[0]));
      }
      else if(tokens && tokens.length === 0) {
        // Update the auth token to be loaded (not undefined) but empty (null)
        store.dispatch(actions.setAuthToken({ token: null }));
      }
  }).catch(error => {
    store.dispatch(actions.loadFromStorageError(error));
  });
}

/**
 * Loading auth token from middleware
 */
export default (storeStorageService) => store => next => action => {

  if (action.type === actions.ACTION_TYPES.loadFromStorage.load) {
    return handleLoadFromStorageAction(store, storeStorageService);
  }

  if (action.type === actions.ACTION_TYPES.saveAuthTokenToStorage) {
    return storeStorageService.tokens.setAsync(action.payload); // fire and forget - save to storage
  }

  return next(action);
}