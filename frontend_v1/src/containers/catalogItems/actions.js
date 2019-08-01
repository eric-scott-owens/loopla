import { createAction } from 'redux-actions';
import * as fetchResourceActions from '../../actions/fetchResource';
import configuration from '../../configuration';

export const ACTION_TYPES = {
  all: {
    set: 'SET-CATALOG-ITEMS'
  },
  single: {
    set: 'SET-CATALOG-ITEM'
  }
};

export const setCatalogItem = (id, payload) => ({
  type: ACTION_TYPES.single.set,
  id,
  payload
});

export const setCatalogItems = createAction(ACTION_TYPES.all.set);

export const fetchCatalogItem = id => async dispatch => {
  try {
    const catalogItem = await dispatch(fetchResourceActions.fetch(configuration.MODEL_TYPES.catalogItem, id));
    dispatch(setCatalogItem(id, catalogItem));
  } catch(error) {
    // Let the fetch resource reducers take care of error notifications
  }
}

export const fetchCatalogItems = () => async dispatch => {
  try {
    const catalogItems = await dispatch(fetchResourceActions.fetch(configuration.MODEL_TYPES.catalogItem));
    dispatch(setCatalogItems(catalogItems));
  } catch(error) {
    // Let the fetch resource reducers take care of error notifications
  }
}