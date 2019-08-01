import forEach from 'lodash/forEach';
import values from 'lodash/values';
import { handleActions } from 'redux-actions';
import * as actions from './actions';

const initialState = {} // Dictionary indexed by id

export function process(state, tag) {
  const dictionary = Object.assign({}, state);
  dictionary[tag.id] = tag;
  
  return dictionary;
}

export const tagsReducers = handleActions({
  [actions.ACTION_TYPES.single.set]: (state, action) =>  {
    const newState = process(state, action.payload);
    return newState;
  },
  [actions.ACTION_TYPES.all.set]: (state, action) => {
    let currentState = Object.assign({}, state);
    forEach(action.payload, single => {
      currentState = process(currentState, single);
    });

    return currentState;
  }
}, initialState);

export const topTagReducer = handleActions({
  [actions.ACTION_TYPES.setTopTagsForGroup]: (state, action) => {
    const topTags = values(action.payload).sort((a, b) => b.count - a.count).map(tr => tr.id);
    return topTags;
  }
}, null);
