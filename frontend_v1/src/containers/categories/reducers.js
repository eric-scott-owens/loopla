import { handleActions } from 'redux-actions';
import forEach from 'lodash/forEach';
import * as actions from './actions';


export const lastVisitedCategoryIdReducer = handleActions({
  [actions.ACTION_TYPES.setLastVisitedCategoryId]: (state, action) => action.payload || null
}, null);

export const reducers = handleActions({
    [actions.ACTION_TYPES.setCategories]: (state, action) => {
      const categories = action.payload;
      const updatedCategories = {...state};
      forEach(categories, category => {
        updatedCategories[category.id] = category;

        if(category.parentId) {
          const parent = updatedCategories[category.parentId];
          if(parent) {
            // eslint-disable-next-line
            category.parent = parent;
            parent.children.push(category.id);
          }
        }
        else {
          // eslint-disable-next-line
          category.children = [];
        }
      });

      const updatedState = Object.assign({}, state, updatedCategories);
    
      return updatedState;
    },
  },
  // Initializer
  {}
);