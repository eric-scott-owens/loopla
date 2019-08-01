// <summary>
// The supported fetch action types
// </summary>
export const ACTION_TYPES = {
  fetch: 'FETCH-RESOURCE',
  fetchBatch: 'FETCH-BATCH-RESOURCES',
  post: 'POST-RESOURCE',
  put: 'PUT-RESOURCE',
  patch: 'PATCH-RESOURCE',
  delete: 'DELETE-RESOURCE',

  pending: 'FETCH-RESOURCE-PENDING',
  error: 'FETCH-RESOURCE-ERROR',
  complete: 'FETCH-RESOURCE-COMPLETE'
}

// <summary> 
// The action dispatched to initiate a fetch resource request
// </summary>
export const fetch = (resourceType, resourceId, forceDuplicateRequest) => ({
  type: ACTION_TYPES.fetch,
  resourceType,
  resourceId,
  forceDuplicateRequest
});

export const fetchBatch = (resourceType, resourceIds) => ({
  type: ACTION_TYPES.fetchBatch,
  resourceType,
  resourceIds
});

export const post = (resourceType, resource) => ({
  type: ACTION_TYPES.post,
  resourceType,
  resource
});

export const put = (resourceType, resource) => ({
  type: ACTION_TYPES.put,
  resourceType,
  resource
});

export const patch = (resourceType, resource) => ({
  type: ACTION_TYPES.patch,
  resourceType,
  resource
});

export const deleteResource = (resourceType, resourceId) => ({
  type: ACTION_TYPES.delete, 
  resourceType, 
  resourceId
});


// <summary>
// Action dispatched when a fetch resource request is in process
// </summary>
export const pending = (resourceType, resourceId, httpVerb) => ({
  type: ACTION_TYPES.pending,
  resourceType,
  resourceId,
  httpVerb, 
});

// <summary>
// Action dispatched when a fetch resource requested has failed
// </summary>
export const error = (resourceType, resourceId, httpVerb, errorObj) => ({
  type: ACTION_TYPES.error,
  resourceType,
  resourceId,
  httpVerb,
  errorObj
});

// <summary> 
// Action dispatched when a fetch resource request has been completed
// </summary>
export const complete = (resourceType, resourceId, httpVerb) => ({
  type: ACTION_TYPES.complete,
  resourceType,
  resourceId,
  httpVerb
});