import { createAction } from 'redux-actions';
import * as fetchResourceActions from '../../actions/fetchResource';
import configuration from '../../configuration';

export const ACTION_TYPES = {
  setCategories: 'SET-CATEGORIES',
  setLastVisitedCategoryId: 'LAST-VISITED-CATEGORY-ID'
};

export const setLastVisitedCategoryId = createAction(ACTION_TYPES.setLastVisitedCategoryId);

export const setCategories = (payload) => ({
  type: ACTION_TYPES.setCategories,
  payload
});

export const fetchCategory = (categoryId) => async dispatch => {
  try {
    const category = await dispatch(fetchResourceActions.fetch(configuration.MODEL_TYPES.category, categoryId));
    dispatch(setCategories([category]));
  } catch(error) {
    // Let the fetch resource reducers take care of error notifications
  }
};

export const fetchCategories = () => async dispatch => {

  try {
    const categories = await dispatch(fetchResourceActions.fetch(configuration.MODEL_TYPES.category));
    dispatch(setCategories(categories));
  } catch(error) {
    // Let the fetch resource reducers take care of error notifications
  }

};

export const batchFetchCategories = (ids) => async dispatch => {
  try {
    const results = await dispatch(fetchResourceActions.fetchBatch(configuration.MODEL_TYPES.category, ids));
    dispatch(setCategories(results.loaded));
  } catch(error) {
    // Let the fetch resource reducers take care of error notifications
  }
}