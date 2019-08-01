import throttleQueue from 'throttled-queue';
import * as actions from '../containers/places/googlePlaces/actions';
import HttpStatusError from '../errors/HttpStatusError';
import { shouldPlaceBePurgedFromCache, keyFor } from '../utilities/ObjectUtilities';
import configuration from '../configuration';

/**
 * Dictionary of in flight promises from the GooglePlacesService indexed by placeId
 */
const inFlightPromises = {};

/**
 * Create a throttled queue set to send requests to the Google API 
 * no faster than 10 queries per second (QPS)
 */
const throttle = throttleQueue(5, 2000);

/**
 * Handles request to load place details from Google
 * @param {ReduxStore} store 
 * @param {ReduxAction} action 
 * @param {GooglePlacesService} googlePlacesService 
 * @param {StoreStorageService} storeStorageService 
 */
function handleFetchAction(store, action, googlePlacesService, storeStorageService) {
  const placeId = action.payload;
  if(!placeId) throw new Error('placeId is required');
  
  // If a request for this place is already in flight, respond to it.
  const otherPromise = inFlightPromises[placeId];
  if(otherPromise) {
    return otherPromise;
  }
  
  // It's not in flight at the moment, time to create a new
  // promise to handle this thing.
  const jobPromise = new Promise((resolve, reject) => {

    // If we've already got the place in the store, use it :)
    const state = store.getState();
    const googlePlace = state.googlePlaces[placeId];
    if(googlePlace) {
      const error = new HttpStatusError(200, 'cached', googlePlace);
      reject(error);
      return; // all done here
    }

    // Check if we already have it in local storage
    const localStoragePromise = storeStorageService.googlePlaces.getAsync(keyFor.GooglePlace({ id: placeId }));
    localStoragePromise.then((result) => {
      if(result) {
        if(shouldPlaceBePurgedFromCache(result)) {
          try {
            storeStorageService.googlePlaces.removeAsync(result.key);
          } catch(error) {
            // should this error get logged?
            // I'm really just doing this in case of some weird concurrency event.
          }
        } else {
          // The google place was already in local storage :)
          resolve(result);
          return; // all done here
        }
      }

      // Try to fetch the resource from the Google Service, but throttle
      // requests so we don't get flack for going to fast.
      throttle(() => {
        const googlePromise = googlePlacesService.getDetails(placeId, configuration.google.PLACE_FIELDS);
        inFlightPromises[placeId] = googlePromise; // track this to completion
        googlePromise.then(place => {
          resolve(place);
          delete inFlightPromises[placeId]; // stop tracking this promise
          storeStorageService.googlePlaces.setAsync(place); // fire and forget - save to storage
          actions.set(place);
        }).catch(error => {
          store.dispatch(actions.error(error, placeId));
          reject(error);
          delete inFlightPromises[placeId]; // stop tracking this promise
        })
      });

    });


  });

  return jobPromise;
}

/**
 * Middleware that handles retrieving place details from Google
 */
export default (googlePlacesService, storeStorageService) => store => next => action => {

  if (action.type === actions.ACTION_TYPES.fetch) {
    return handleFetchAction(store, action, googlePlacesService, storeStorageService);
  }

  return next(action);
}