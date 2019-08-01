import { handleActions } from 'redux-actions';
import forEach from 'lodash/forEach';
import * as actions from './actions';

export const initializeAvailableKudos = handleActions({}, {});

export const globalReducers = handleActions({
  [actions.ACTION_TYPES.setAvailableKudos]: (state, action) => {
    const availableKudos = Object.assign({}, state.availableKudos);

    const kudosDictionary = action.payload;
    forEach(kudosDictionary, (quantity, id) => { 
      availableKudos[id] = quantity;
    });

    const updatedState = {
      ...state,
      availableKudos
    };

    return updatedState;
  },
  [actions.ACTION_TYPES.setFullKudo]: (state, action) => {
    const kudos = Object.assign({}, state.kudos);

    kudos[action.payload.id] = action.payload;  

    const updatedState = {
      ...state,
      kudos
    };

    return updatedState;
  },
  [actions.ACTION_TYPES.clearAvailableKudos]: (state) => {
    const availableKudos = Object.assign({}, {});

    const updatedState = {
      ...state,
      availableKudos
    };

    return updatedState;
  },
},
// Initializer
  {}
);