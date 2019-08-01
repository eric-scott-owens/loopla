import { handleActions } from 'redux-actions';
import forEach from 'lodash/forEach';
import * as actions from './actions';

export const initializeCatalogItems = handleActions({}, {});

export const globalReducers = handleActions({
  [actions.ACTION_TYPES.single.set]: (state, action) => {
    const catalogItems = Object.assign({}, state.catalogItems);
    const catalogItem = action.payload;
    catalogItems[catalogItem.id] = catalogItem;

    const updatedState = {
      ...state,
      catalogItems
    };

    return updatedState;
  },

  [actions.ACTION_TYPES.all.set]: (state, action) => {
    const catalogItems = Object.assign({}, state.catalogItems);
    forEach(action.payload, catalogItem => { 
      catalogItems[catalogItem.id] = catalogItem;
    });

      
    const updatedState = {
      ...state,
      catalogItems
    };

    return updatedState;
  }

}, {});