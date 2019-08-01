import forEach from 'lodash/forEach';
import { handleActions } from 'redux-actions';
import { ACTION_TYPES as actionTypes } from './actions';


const initialState = {} // Dictionary indexed by id

export function process(state, place) {
  const updatedState = Object.assign({}, state);
  updatedState[place.id] = place;
  return updatedState;
}

const reducers = handleActions({
  [actionTypes.single.set]: (state, action) =>  {
    const newState = process(state, action.payload);
    return newState;
  },
  [actionTypes.all.set]: (state, action) => {
    let currentState = Object.assign({}, state);
    forEach(action.payload, single => {
      currentState = process(currentState, single);
    });

    return currentState;
  },
  [actionTypes.batch.set]: (state, action) => {
    // Ready to move into a global reducer when google places
    // can also be batch loaded
    let placesState = {...state};
    forEach(action.places, single => {
      placesState = process(placesState, single);
    })

    return placesState;
  },
  [actionTypes.reset]: (state, action) => ({}),
}, initialState);

export default reducers;