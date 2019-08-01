// <summary>
// The supported fetch action types
// </summary>
export const ACTION_TYPES = {
  fetch: 'FETCH',
  pending: 'FETCH-PENDING',
  error: 'FETCH-ERROR',
  complete: 'FETCH-COMPLETE'
}

// <summary> 
// The action dispatched to initiate a fetch request
// </summary>
export const fetch = (url, params) => ({
  type: ACTION_TYPES.fetch,
  url,
  params,
});

// <summary>
// Action dispatched when a fetch is in process
// </summary>
export const pending = (url, params) => ({
  type: ACTION_TYPES.pending,
  url,
  params 
});

// <summary>
// Action dispatched when a fetch requested has failed
// </summary>
export const error = (url, params, errorObj) => ({
  type: ACTION_TYPES.error,
  url,
  params,
  error: errorObj
})

// <summary> 
// Action dispatched when a fetch has been completed
// </summary>
export const complete = (url, params) => ({
  type: ACTION_TYPES.complete,
  url,
  params
});