import forEach from 'lodash/forEach';
import { handleActions } from 'redux-actions';
import * as actions from './actions';
import * as mappers from './mappers';

export function process(state, invitation) {
  const invitations = {...state};
  const convertedMultiUseInvitation = mappers.fromServerMultiUseInvitationObject(invitation);
  invitations[convertedMultiUseInvitation.id] = convertedMultiUseInvitation;
  return invitations;
}

export const multiUseInvitationReducers = handleActions({
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

export const multiUseInvitationPageReducer = handleActions({
  [actions.ACTION_TYPES.setPage]: (state, action) => {
    const { multiUseInvitationPage } = action.payload;

    return multiUseInvitationPage;
  },
  [actions.ACTION_TYPES.remove]: (state) => {
    let updatedState = {...state};
    updatedState = null;
    return updatedState;
  },
}, null);
