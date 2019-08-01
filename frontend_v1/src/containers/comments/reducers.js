import forEach from 'lodash/forEach';
import pull from 'lodash/pull';
import get from 'lodash/get';
import { handleActions } from 'redux-actions';
import * as actions from './actions';
import { fromClientPostObjectToClientPostReferenceObject } from '../posts/mappers';

export function process(state, comment) {
  const comments = {...state.comments};
  comments[comment.id] = comment;

  return {
    ...state,
    comments
  };
}

export const commentScopedReducers = handleActions({}, {});

export const globalReducers = handleActions({
    [actions.ACTION_TYPES.single.set]: (state, action) => process(state, action.payload),
    
    [actions.ACTION_TYPES.all.set]: (state, action) => {
      let updatedState = Object.assign({}, state);
      forEach(action.payload, comment => { updatedState = process(updatedState, comment); });
      return updatedState;
    }
  },
  // Initial State
  {}
);

export const commentCountByUserReducer = handleActions({
    [actions.ACTION_TYPES.setCommentCountForUser]: (state, action) => {
      const numComments = action.payload;
      const userId = action.id;
      const newCommentCountByUser  = {...state};
      newCommentCountByUser[userId] = numComments;
      return newCommentCountByUser;
    }
  },
  // Initial State 
  {}
);