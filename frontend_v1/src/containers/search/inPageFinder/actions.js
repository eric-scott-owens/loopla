import { createAction } from 'redux-actions';

export const ACTION_TYPES = {
  setContext: 'SET_FINDER_CONTEXT',
  clearContext: 'CLEAR_FINDER_CONTEXT'
};

export const setContext = createAction(ACTION_TYPES.setContext);
export const clearContext = createAction(ACTION_TYPES.clearContext);
