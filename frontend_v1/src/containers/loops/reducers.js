import forEach from 'lodash/forEach';
import { handleActions } from 'redux-actions';
import * as actions from './actions';

const initialState = {} // Dictionary indexed by id

export function process(state, group) {
  const groups = {...state};
  groups[group.id] = group;
  return groups;
}

export const lastVisitedGroupIdReducer = handleActions({
  [actions.ACTION_TYPES.setLastVisitedGroupId]: (state, action) => action.payload,
  
}, null);

export const groupsReducers = handleActions({
  [actions.ACTION_TYPES.single.set]: (state, action) =>  {
    const newState = process(state, action.payload);
    return newState;
  },
  [actions.ACTION_TYPES.all.set]: (state, action) => {
    let currentState = state;
    forEach(action.payload, single => {
      currentState = process(currentState, single);
    });

    return currentState;
  },
  [actions.ACTION_TYPES.reset]: (state, action) => ({}),

}, initialState);



