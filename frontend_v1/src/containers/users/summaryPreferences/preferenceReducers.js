import forEach from 'lodash/forEach';
import { handleActions } from 'redux-actions';
import * as actions from './preferenceActions';

export const initializers = ({

})

export const reducers = handleActions({
  [actions.ACTION_TYPES.summary.user.set]: (state, action) => {
    const preferencesArray = action.payload;
    let updatedState = state;

    const prefArray = {};
    forEach(preferencesArray, preference => {
      prefArray[preference.id] = preference;
    });

    updatedState = Object.assign({}, updatedState, prefArray)

    return updatedState;
  },
}, 
// Initial State
{});
