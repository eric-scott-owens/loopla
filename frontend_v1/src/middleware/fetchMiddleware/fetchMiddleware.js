// <attribution>
// Initial concept derived from "You Aren't Using Redux Middleware Enough - Jacob Parker",
// https://medium.com/@jacobp100/you-arent-using-redux-middleware-enough-94ffe991e6,
// Accessed 22AUG2018
// </attribution>

import { mapObject } from '../../utilities/ObjectUtilities';
import * as fetchActions from '../../actions/fetch';
import prepFetchParamsAsync from '../../utilities/FetchUtilities';

// <summary>
// Handles all fetch requests and ensures that return results are camel cased 
// instead of underscored
// </summary>
/* eslint-disable no-unused-vars */
export default (fetchImplementation, stateTracker) => store => next => async action => {
  /* eslint-enable no-unused-vars */
  if (action.type === fetchActions.ACTION_TYPES.fetch) {

    const { url, params } = action;
    if(stateTracker) { stateTracker.addPendingRequest(url, params); }

    // Kick off the fetch request
    const fetchParams = await prepFetchParamsAsync(params, store);
    try {
      const response = await fetchImplementation(url, fetchParams);
      
      // If the request seems to have succeeded kick of the
      // data handling pipeline and run a catch over that pipeline
      // just in case
      if(response.status >= 200 && response.status < 300) {
        try {
          let mappedObject;
          
          // If we have a body, populate mappedObject
          try {
            // Unfortunately, Cordova doesn't include the headers, so we just have to
            // put up with the performance hit (or use a different fetch implementation)
            const json = await response.json();
            mappedObject = mapObject.fromUnderScoredObject(json);
          } catch(e) {
            mappedObject = undefined;
          }

          if(stateTracker) { stateTracker.removePendingRequest(url, params); }
          return mappedObject;
        }
        catch(error) {
          if(stateTracker) { stateTracker.removePendingRequest(url, params); }
          throw error;
        }
      } else {
        if(stateTracker) { stateTracker.removePendingRequest(url, params); }
        throw response;
      }
    }
    catch(error) {
      if(stateTracker) { stateTracker.removePendingRequest(url, params); }
      throw error;
    }
  } 
  
  return next(action);
};