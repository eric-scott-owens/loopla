import forEach from 'lodash/forEach';
import { handleActions } from 'redux-actions';
import { ACTION_TYPES as actionTypes }from './actions';


const initialState = {} // Dictionary indexed by id

function process(state, single) {
  const dictionary = Object.assign({}, state);
  dictionary[single.id] = single;
  
  return dictionary;
}

const reducers = handleActions({
  [actionTypes.set]: (state, action) =>  {
    const newState = process(state, action.payload);
    return newState;
  },
  [actionTypes.batch.set]: (state, action) => {
    let updatedState = {...state};
    const googlePlaces = action.payload;
    forEach(googlePlaces, googlePlace => {
      updatedState = process(updatedState, googlePlace);
    });

    return updatedState;
  }
}, initialState);

export default reducers;