import { handleActions } from 'redux-actions';

import { ACTION_TYPES } from './actions';
import SearchContext from '../SearchContext';

// eslint-disable-next-line
export const scopedReducers = handleActions({
  [ACTION_TYPES.setContext]: (state, action) => action.payload,
  [ACTION_TYPES.clearContext]: () => new SearchContext()
}, new SearchContext());
