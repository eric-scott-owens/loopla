import { createAction } from 'redux-actions';
import forEach from 'lodash/forEach';
import keys from 'lodash/keys';
import configuration from '../../configuration';
import { batchFetchGooglePlaces } from './googlePlaces/actions';
import * as fetchResourceActions from '../../actions/fetchResource';

export const ACTION_TYPES = {
  all: {
    fetch: 'FETCH-PLACES',
    set: 'SET-PLACES'
  },
  single: {
    fetch: 'FETCH-PLACE',
    set: 'SET-PLACE'
  },
  batch: {
    set: 'BATCH-SET-PLACES'
  },
  reset: 'RESET-PLACES'
}

export const setPlace = (id, payload) => ({
  type: ACTION_TYPES.single.set,
  id,
  payload
});

export const setPlaces = createAction(ACTION_TYPES.all.set);

export const resetPlaces = createAction(ACTION_TYPES.reset);

export const fetchPlace = placeId => async dispatch => {
  try {
    const place = await dispatch(fetchResourceActions.fetch(configuration.MODEL_TYPES.place, placeId));
    dispatch(setPlace(placeId, place));
  } catch(error) {
    // Let the fetch resource reducers take care of error notifications
  }
}

export const fetchPlaces = () => async dispatch => {
  try {
    const places = await dispatch(fetchResourceActions.fetch(configuration.MODEL_TYPES.place));
    dispatch(setPlaces(places));
  } catch(error) {
    // Let the fetch resource reducers take care of error notifications
  } 
}


const batchSetPlaceDefaultConfig = {
  places: [],
  cachedPlaces: [],
  googlePlaces: [],
  cachedGooglePlaces: []
};
export const batchSetPlaceData = (config) => ({
  type: ACTION_TYPES.batch.set,
  ...batchSetPlaceDefaultConfig,
  ...config
});


const defaultChildrenToBatchLoad = {
  googlePlace: true
};
export const batchFetchPlaces = (ids, childrenToBatchLoad) => async dispatch => {
  const batchPromise = new Promise((resolve, reject) => {
    const placeIds = ids.slice(0);
    const placePromise = dispatch(fetchResourceActions.fetchBatch(configuration.MODEL_TYPES.place, placeIds));
    placePromise.then(placeResults => {
      const config = {...defaultChildrenToBatchLoad, ...childrenToBatchLoad};
      const places = placeResults.loaded;
      const cachedPlaces = placeResults.cached;

      const googlePlaceIdsHash = {};
      
      // Collect google places to batch load
      if(config.googlePlace) {
        forEach(places, place => {
          if(!place.is_user_generated) {
            googlePlaceIdsHash[place.name] = true;
          }
        });

        forEach(cachedPlaces, place => {
          if(!place.isUserGenerated) {
            googlePlaceIdsHash[place.googlePlaceId] = true;
          }
        })
      }

      // Fetch requested googlePlaceIds
      const googlePlaceIds = keys(googlePlaceIdsHash);
      
      // TODO !!!!
      // Need to move google places into our database so they
      // can be truly batch loaded. This really just fires off a bunch 
      // of separate requests through to google service... and because it
      // goes through batchFetchGooglePlaces it resolves the GooglePlace objects
      // in its own redux update.
      const googlePlacesPromise = dispatch(batchFetchGooglePlaces(googlePlaceIds));

      // Wait for all the google places to be loaded
      googlePlacesPromise.then((googlePlaceResults) => {
        const googlePlaces = googlePlaceResults.loaded;
        const cachedGooglePlaces = googlePlaceResults.cached;

        dispatch(batchSetPlaceData({
          places,
          cachedPlaces,
          // TODO !!!
          // Just here to help me pretend the big TODO above doesn't exist :)
          googlePlaces, 
          cachedGooglePlaces
        }));

        resolve({
          places,
          googlePlaces
        });
      }).catch(error => {
        reject(error);
      }) 
    })
  });

  return batchPromise;
}

