import forEach from 'lodash/forEach';
import { handleActions } from 'redux-actions';
import * as actions from './actions';

export function process(state, invitation) {
  const invitations = {...state};
  invitations[invitation.id] = invitation;
  return invitations;
}

export const invitationReducers = handleActions({
  [actions.ACTION_TYPES.single.set]: (state, action) => {
    const newState = process(state, action.payload);
    return newState;
  },
  [actions.ACTION_TYPES.all.set]: (state, action) => {
    let updatedState = state;
    forEach(action.payload, invitation => {
      updatedState = process(updatedState, invitation);
    });

    return updatedState;
  },
},
// Initial State
{});

export const invitationPageReducer = handleActions({
  [actions.ACTION_TYPES.setPage]: (state, action) => {
    const { invitationPage } = action.payload;

    return invitationPage;
  },
  [actions.ACTION_TYPES.remove]: (state) => {
    let updatedState = {...state};
    updatedState = null;
    return updatedState;
  },
}, null);
