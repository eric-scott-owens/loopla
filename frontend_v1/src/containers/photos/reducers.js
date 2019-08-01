import forEach from 'lodash/forEach';
import { handleActions } from 'redux-actions';
import * as actions from './actions';

const initialState = {} // Dictionary indexed by id

export function process(state, photo) {
  const dictionary = Object.assign({}, state);
  dictionary[photo.id] = photo;
  
  return dictionary;
}

const reducers = handleActions({
  [actions.ACTION_TYPES.single.set]: (state, action) =>  {
    const newState = process(state, action.payload);
    return newState;
  },
  [actions.ACTION_TYPES.all.set]: (state, action) => {
    let currentState = Object.assign({}, state);
    forEach(action.payload, single => {
      currentState = process(state, single);
    });

    return currentState;
  },
  [actions.ACTION_TYPES.reset]: (state, action) => ({}),
}, initialState);

export default reducers;