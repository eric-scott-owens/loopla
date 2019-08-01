import forEach from 'lodash/forEach';
import { createAction } from 'redux-actions';

export const ACTION_TYPES = {
  fetch: 'FETCH-GOOGLE-PLACE',
  pending: 'FETCH-GOOGLE-PLACE-PENDING',
  error: 'FETCH-GOOGLE-PLACE-ERROR',
  complete: 'FETCH-GOOGLE-PLACE-COMPLETE',
  set: 'SET-GOOGLE-PLACE',

  batch: {
    set: 'BATCH-SET-GOOGLE-PLACES'
  }
}

export const fetch = createAction(ACTION_TYPES.fetch);
export const pending = createAction(ACTION_TYPES.pending);
export const error = createAction(ACTION_TYPES.error);
export const set = createAction(ACTION_TYPES.set);

export const complete = (id, payload) => ({
  type: ACTION_TYPES.complete,
  id,
  payload
});


export const fetchGooglePlace = (googlePlaceIds) => async dispatch => {
  try{
    const place = await dispatch(fetch(googlePlaceIds));
    dispatch(set(place));
    return place;
  } catch(myError) {
    // Let the fetch resource reducers take care of error notifications
  }
}

function dontWorryErrorHandler() {};

export const batchSetGooglePlaces = createAction(ACTION_TYPES.batch.set);
export const batchFetchGooglePlaces = (googlePlaceIds) => dispatch => {
  const batchPromise = new Promise((resolve, reject) => {
    const promises = [];
    forEach(googlePlaceIds, id => {
      const fetchPromise = dispatch(fetch(id));
      fetchPromise.then(dontWorryErrorHandler).catch(dontWorryErrorHandler);
      promises.push();
    })
  
    Promise.all(promises).finally(() => {
      const loadedGooglePlaces = [];
      const cachedGooglePlaces = [];
      const nonCacheBasedErrors = [];
      forEach(promises, promise => {
        promise.then(newData => {
          loadedGooglePlaces.push(newData)
        }).catch(myError => {
          if(
            myError 
            && myError.statusCode === 200 
            && myError.statusMessage === 'cached' 
            && myError.data
          ) {
            cachedGooglePlaces.push(myError.data);
          } else {
            nonCacheBasedErrors.push(myError);
          }
        });
      });

      // Let all the promises resolve...
      setTimeout(() => {
        // No matter what... lets get this data into the cache
        if(loadedGooglePlaces.length > 0) {
          dispatch(batchSetGooglePlaces(loadedGooglePlaces));
        }

        // Now... resolve or reject based on the presence of non cache
        // related errors.
        if(nonCacheBasedErrors.length === 0) {
          resolve({ loaded: loadedGooglePlaces, cached: cachedGooglePlaces });
        } else {
          reject(new Error(nonCacheBasedErrors));
        }
      });
      
    });
  });

  return batchPromise;
}

