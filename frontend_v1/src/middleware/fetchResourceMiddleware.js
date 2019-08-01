import forEach from 'lodash/forEach';
import keys from 'lodash/keys';
import uniq from 'lodash/uniq';
import get from 'lodash/get';
import decamelize from 'decamelize';
import { isResourceStale, getTableNameFor, getTableNameForModelType, keyFor, mapObject } from '../utilities/ObjectUtilities';
import { fetch } from '../actions/fetch';
import * as actions from '../actions/fetchResource';
import configuration from '../configuration';
import HttpStatusError from '../errors/HttpStatusError';
import { HttpMethods, StandardHeaders } from '../containers/http';

const inFlightPromises = {};

function createResourceUrlFor(resourceType, resourceId) {
  const tableName = getTableNameForModelType(resourceType);
  const urlName = decamelize(tableName, '-');
  let resourceUrl;

  if(resourceId) {
    resourceUrl = `${configuration.API_ROOT_URL}/${urlName}/${resourceId}/`;
  }
  else{
    resourceUrl = `${configuration.API_ROOT_URL}/${urlName}/`;
  }    
  
  return resourceUrl;
};


function getCachedResource(store, resourceType, resourceId) {
  // If we've already got the resource in the store, use it :)
  const state = store.getState();
  const tableName = getTableNameForModelType(resourceType);
  const cachedResource = (state && state[tableName]) ? state[tableName][resourceId] : null;
  return (cachedResource && !isResourceStale(cachedResource)) ? cachedResource : undefined;
};

// eslint-disable-next-line
function createFetchActionJob_makeHttpRequestAndResolvePromise(store, resourceType, resourceId, resourceUrl, httpVerb, resolve, reject) {
  const fetchPromise = store.dispatch(fetch(resourceUrl, { method: httpVerb }));
  inFlightPromises[resourceUrl] = fetchPromise;
  fetchPromise.then(fetchedResource => {
    store.dispatch(actions.complete(resourceType, resourceId, httpVerb));
    resolve(fetchedResource);
    delete inFlightPromises[resourceUrl];
  }).catch(error => {
    // No good!
    store.dispatch(actions.error(resourceType, resourceId, httpVerb, error));
    reject(error);
    delete inFlightPromises[resourceUrl];
  });
}

function createFetchActionJob(store, action, resourceType, resourceId, resourceUrl, modelMapperService, storeStorageService) {
  const jobPromise = new Promise((resolve, reject) => {
    const httpVerb = HttpMethods.GET;
    
    // If we've already got the resource in the store, use it :)
    const cachedResource = getCachedResource(store, resourceType, resourceId);
    if(cachedResource) {
      reject(new HttpStatusError(200, 'cached', cachedResource)); // Tell the caller that we don't have new data from the server to return
      return; 
    }

    // Look for resources in local storage
    if (resourceId)
    {
      const tableName = getTableNameForModelType(resourceType);
      const getPromise = storeStorageService[tableName].getAsync(keyFor({ model: resourceType, id: resourceId }));
      getPromise.then((localResource) => {
        if (localResource)
        {
          const mappedResource = modelMapperService.fromDeserializedClientModel(localResource, store.getState())
          resolve(mappedResource);
        }
        else{
          createFetchActionJob_makeHttpRequestAndResolvePromise(store, resourceType, resourceId, resourceUrl, httpVerb, resolve, reject);
        }
      });
    }
    else
    {
      createFetchActionJob_makeHttpRequestAndResolvePromise(store, resourceType, resourceId, resourceUrl, httpVerb, resolve, reject);
    }
  });

  return jobPromise;
};
// Function from: https://stackoverflow.com/questions/1058427/how-to-detect-if-a-variable-is-an-array
function isArray(obj) {
  return Object.prototype.toString.call(obj) === '[object Array]';
}

function dontCareErrorHandler() {

};

function handleFetchAction(store, action, modelMapperService, storeStorageService) {
  const { resourceType, resourceId } = action;
  const resourceUrl = createResourceUrlFor(resourceType, resourceId);
  const jobPromise = new Promise((resolve, reject) => {
    let fetchActionPromise; // Populated if a new AJAX call is made

    // If a request for this place is already in flight, respond to it.
    const otherPromise = inFlightPromises[resourceUrl];
    if(otherPromise) {
      if(action.forceDuplicateRequest) {
        // need to forcibly duplicate this call
        // When the current one is done running, queue up this one.
        otherPromise.finally(() => {
          fetchActionPromise = createFetchActionJob(store, action, resourceType, resourceId, resourceUrl, modelMapperService, storeStorageService);
          
          // Make sure we chain forced calls
          inFlightPromises[resourceUrl] = fetchActionPromise;
        });
      }
      else {
        // No need to duplicate work - or reload data
        reject(new HttpStatusError(200, 'cached')); // Tell the caller that we don't have new data from the server to return
        return; // all done here
      }
      
    } else {
      fetchActionPromise = createFetchActionJob(store, action, resourceType, resourceId, resourceUrl, modelMapperService, storeStorageService);
    }

    // Resolve or reject the jobPromise with the data from the fetchActionPromise
    if(fetchActionPromise) {
      fetchActionPromise.then((result) => {

        const state = store.getState();
        let mappedResult;

        // Resolve the current jub with the fetch action's return value
        const tableName = getTableNameForModelType(resourceType);
        if (isArray(result))
        {
          mappedResult = [];
          forEach(result, resource => {
            const mappedResource = modelMapperService.toClientModel(resource, state);
            mappedResource.key = keyFor(mappedResource);
            mappedResult.push(mappedResource);
            
            const setPromise = storeStorageService[tableName].setAsync(mappedResource);
            setPromise.catch(() => {
              const error = new HttpStatusError(200, 'Not working', "Error with local Storage");
              reject(error);
            });
          });
        }
        else
        {
          mappedResult = modelMapperService.toClientModel(result, state);
          const setPromise = storeStorageService[tableName].setAsync(mappedResult);
          setPromise.catch(() => {
            const error = new HttpStatusError(200, 'Not working', "Error with local Storage");
            reject(error);
          });
        }
        resolve(mappedResult);
      }).catch((error) => {
        reject(error);
      });
    }
  })  

  return jobPromise;
};

function handleFetchBatchAction(store, action, modelMapperService, storeStorageService) {
  const jobPromise = new Promise((resolve, reject) => {
    const { resourceType } = action;
    const tableName = getTableNameForModelType(resourceType);
    const resourceIds = uniq(action.resourceIds);
    const state = store.getState();

    // Return now if we don't have anything left to do
    if(resourceIds.length === 0) {
      resolve({ loaded: [], cached: []}); // No resources to return... everything is already here or in flight
      return;
    }

    // Get the ids of the items we need to fetch from the server
    const serverIds = [];
    const cachedResources = [];
    const localStorageResources = [];
    const inFlightPromisesToIncludeInCachedResources = [];
    const batchFetchMetadata = {};
    
    // Check the local storage for items cached
    // If not found, store the ID for our batch server request
    const localResourcePromises = [];
    forEach(resourceIds, resourceId => {
      const resourceUrl = createResourceUrlFor(resourceType, resourceId);
      const inFlightPromise = inFlightPromises[resourceUrl];
      const cachedResource = getCachedResource(store, resourceType, resourceId);
      
      if(cachedResource) {
        // Don't fetch items that are already cached
        cachedResources.push(cachedResource)
      } else if(inFlightPromise) {
        // Don't fetch items for which server requests are already in flight
        inFlightPromisesToIncludeInCachedResources.push(inFlightPromise);
      }
      else if(resourceId)
      {
        // We need to make a server request. Set it up, including faking the appropriate
        // in flight promise
        const localResourcePromise = storeStorageService[tableName].getAsync(keyFor({ model: resourceType, id: resourceId}));
        localResourcePromises.push(localResourcePromise);
        localResourcePromise.then((localResource) => {
          if(localResource){
            const mappedResource = modelMapperService.fromDeserializedClientModel(localResource, state);
            localStorageResources.push(mappedResource);
          }
          else {
            // This resource needs to be batch loaded
            serverIds.push(resourceId);
            
            const resourceMetadata = {
              resourceUrl,
              inFlightPromiseResolver: undefined,
              inFlightPromiseRejecter: undefined
            };
            
            // Create a promise that we will resolve later with the batched data
            const fakeInFlightPromise = new Promise((myResolve, myReject) => {
              resourceMetadata.inFlightPromiseResolver = myResolve;
              resourceMetadata.inFlightPromiseRejecter = myReject;
            });
    
            // Silence promise errors we really don't need to worry about
            fakeInFlightPromise.catch(dontCareErrorHandler);
    
            inFlightPromises[resourceUrl] = fakeInFlightPromise;
            batchFetchMetadata[resourceId] = resourceMetadata;
          }
        })
      } 
    });

    Promise.all(localResourcePromises).then(() => {
      // Return now if we don't have anything left to do
      if(serverIds.length === 0 && cachedResources.length === 0 && inFlightPromisesToIncludeInCachedResources.length === 0 && localStorageResources.length === 0) {
        resolve({ loaded: [], cached: []}); // No resources to return... everything is already here or in flight
        return;
      }
      
      // We do have things to load from the server
      const urlName = decamelize(tableName, '-');
      const httpVerb = HttpMethods.POST;

      // Pick the right promise... 
      let fetchActionPromise;
      if(serverIds.length > 0) {
        // Actually talk to the server :)
        const batchResourceUrl = `${configuration.API_ROOT_URL}/batch/${urlName.toLowerCase()}/`;
        const json =  JSON.stringify({ ids: serverIds});
        fetchActionPromise = 
          store.dispatch(
            fetch(
              batchResourceUrl, 
              { 
                method: httpVerb, 
                body: json,
                headers: StandardHeaders.AJAX  
              }
            )
          );
      } else {
        // Don't actually talk to the server if we don't need to
        fetchActionPromise = new Promise(fakeResolver => { fakeResolver([]); });
      }
        
      Promise.all([fetchActionPromise, ...inFlightPromisesToIncludeInCachedResources]).then((results) => {
        store.dispatch(actions.complete(resourceType, resourceIds, httpVerb));
        
        const resources = results[0];
        const inFlightData = results.slice(1, results.length);
        const mappedResources = [];

        // Update all of the in flight promises
        forEach(resources, resource => {
          const mappedResource = modelMapperService.toClientModel(resource, state);
          mappedResources.push(mappedResource);

          const resourceMetadata = batchFetchMetadata[resource.id];
          resourceMetadata.inFlightPromiseResolver(resource); // If anyone else is waiting for this resource, let the know we have it
          delete inFlightPromises[resourceMetadata.resourceUrl]; // Remove the in flight promise
          delete batchFetchMetadata[resource.id];
          storeStorageService[tableName].setAsync(mappedResource);
        });

        // If we failed to get back any of the requested data, reject those in flight promises
        const failedKeys = keys(batchFetchMetadata);
        forEach(failedKeys, serverId => {
          const resourceMetadata = batchFetchMetadata[serverId];
          resourceMetadata.inFlightPromiseRejecter('Resource was not returned'); // If anyone else is waiting for this resource, let the know we have it
          delete inFlightPromises[resourceMetadata.resourceUrl]; // Remove the in flight promise
          delete batchFetchMetadata[serverId];
        });

        // Merge together the pre-cached data and the data retrieved in flight 
        // which we will convert and pretend is cached for the sake of consuming 
        // batch actions that spawn child batch requests.
        forEach(inFlightData, serverData => {
          const cachedResource = get(state, `[${tableName}][${serverData.id}]`);
          
          if(cachedResource) {
            cachedResources.push(cachedResource);
          }
        });

        // Loading local resources on the phone
        forEach(localStorageResources, (resource) => {
          if (resource)
          {
            mappedResources.push(resource);
          }
        });
        
        // Resolve the job with our batch loaded data
        resolve({ loaded: mappedResources, cached: cachedResources});
    
      }).catch((error) => {
        store.dispatch(actions.error(resourceType, resourceIds, httpVerb, error));
        
        // reject all of the in flight promises
        const failedKeys = keys(batchFetchMetadata);
        forEach(failedKeys, serverId => {
          const resourceMetadata = batchFetchMetadata[serverId];
          resourceMetadata.inFlightPromiseRejecter(error); // If anyone else is waiting for this resource, let the know we have it
          delete inFlightPromises[resourceMetadata.resourceUrl]; // Remove the in flight promise
          delete batchFetchMetadata[serverId];
        });

        // Reject the job with our batch load error
        reject(error);
      });
        
    });

  });

  return jobPromise;
}

async function handlePostAction(store, action, modelMapperService, storeStorageService) {
  const { resourceType, resource } = action;
  const resourceUrl = createResourceUrlFor(resourceType);
  const httpVerb = 'POST';
  const state = store.getState();
  const serverResource = modelMapperService.toServerModel(resource, state);
  const json = JSON.stringify(Object.assign({}, serverResource, { id: null})); // Set the ID to null for the request

  // Kick of the request via fetch middleware
  try {
    const postedResource = 
      await store.dispatch(
        fetch(resourceUrl, 
            { 
              method: httpVerb, 
              body: json,
              headers: {
                'Content-Type': 'application/json; charset=utf-8'
              }
            }
        )
      );

    
    let mappedResource;
    const tableName = getTableNameForModelType(resourceType);
    if (resource)
    {
      mappedResource = modelMapperService.toClientModel(postedResource, state);
      storeStorageService[tableName].setAsync(mappedResource);
    }

    return mappedResource;
  }
  catch(error) {
    // store.dispatch(actions.error(resourceType, resource.id, httpVerb, error));
    throw error;
  }
  
};

async function handlePutAction(store, action, modelMapperService, storeStorageService) {
  const { resourceType, resource } = action;
  const resourceUrl = createResourceUrlFor(resourceType, resource.id);
  const httpVerb = 'PUT';
  const state = store.getState();
  const serverResource = modelMapperService.toServerModel(resource, state);
  
  const json = JSON.stringify({ ...serverResource });

  // Kick of the request via fetch middleware
  try {
    const putResource = 
      await store.dispatch(
        fetch(resourceUrl, 
            { 
              method: httpVerb, 
              body: json,
              headers: {
                'Content-Type': 'application/json; charset=utf-8'
              }
            }
        )
      );


    let mappedResource;
    const tableName = getTableNameForModelType(resourceType);
    if (putResource)
    {
      mappedResource = modelMapperService.toClientModel(putResource, state);
      storeStorageService[tableName].setAsync(resource);
    }

    return mappedResource;
  }
  catch(error) {
    // store.dispatch(actions.error(resourceType, resource.id, httpVerb, error));
    throw error;
  }
}

async function handlePatchAction(store, action, modelMapperService, storeStorageService) {
  const { resourceType, resource } = action;
  const resourceUrl = createResourceUrlFor(resourceType, resource.id);
  const httpVerb = 'PATCH';
  const state = store.getState();
  
  // Drop anything that's the same
  const originalResource = state[getTableNameFor(resource)][resource.id];
  const patchOnlyResource = { ... resource };
  const resourceKeys = keys(originalResource)

  resourceKeys.forEach(key => {
    if(
      key !== 'model' &&
      key !== 'id' &&
      key !== 'ownerId' &&
      (
        originalResource[key] === patchOnlyResource[key]
        || (
          originalResource[key] === undefined 
          && (patchOnlyResource[key] === '' || patchOnlyResource[key] === null)
        )
      )
    ) {
      delete patchOnlyResource[key];
    }
  })
  
  const serverResource = modelMapperService.toServerModel(patchOnlyResource, state);
  const json = JSON.stringify({ ...serverResource });

  // Kick of the request via fetch middleware
  try {
    const putResource = 
      await store.dispatch(
        fetch(resourceUrl, 
            { 
              method: httpVerb, 
              body: json,
              headers: {
                'Content-Type': 'application/json; charset=utf-8'
              }
            }
        )
      );

    let mappedResource;
    const tableName = getTableNameForModelType(resourceType);
    if (putResource)
    {
      mappedResource = modelMapperService.toClientModel(putResource, state);
      storeStorageService[tableName].setAsync(mappedResource);
    }

    return mappedResource;
  }
  catch(error) {
    // store.dispatch(actions.error(resourceType, resource.id, httpVerb, error));
    throw error;
  }
}

async function handleDeleteAction(store, action, storeStorageService) {
  const { resourceType, resourceId } = action;
  const resourceUrl = createResourceUrlFor(resourceType, resourceId);

  // If a request for this place is already in flight, respond to it.
  const otherPromise = inFlightPromises[resourceUrl];
  if(otherPromise) {
    return otherPromise;
  }
  
  const jobPromise = new Promise((resolve, reject) => {
    // Better try to fetch the resource from the server
    const httpVerb = 'DELETE';
    const fetchPromise = store.dispatch(fetch(resourceUrl, { method: httpVerb }));
    inFlightPromises[resourceUrl] = fetchPromise;
    fetchPromise.then(response => {
      resolve(response);
      delete inFlightPromises[resourceUrl];
      const tableName = getTableNameForModelType(resourceType);
      storeStorageService[tableName].removeAsync(keyFor({ model: resourceType, id: resourceId}));
    }).catch(error => {
      // No good!
      // store.dispatch(actions.error(resourceType, resourceId, httpVerb, error));
      reject(error);
      delete inFlightPromises[resourceUrl];
    });
  });

  return jobPromise;
};

export default (modelMapperService, storeStorageService) => store => next => action => {

  if (action.type === actions.ACTION_TYPES.fetch) {
    return handleFetchAction(store, action, modelMapperService, storeStorageService);
  }

  if (action.type === actions.ACTION_TYPES.fetchBatch) {
    return handleFetchBatchAction(store, action, modelMapperService, storeStorageService);
  }

  if (action.type === actions.ACTION_TYPES.post) {
    return handlePostAction(store, action, modelMapperService, storeStorageService);
  }

  if (action.type === actions.ACTION_TYPES.put) {
    return handlePutAction(store, action, modelMapperService, storeStorageService);
  }

  if (action.type === actions.ACTION_TYPES.patch) {
    return handlePatchAction(store, action, modelMapperService, storeStorageService);
  }

  if (action.type === actions.ACTION_TYPES.delete) {
    return handleDeleteAction(store, action, storeStorageService);
  }

  return next(action);
}