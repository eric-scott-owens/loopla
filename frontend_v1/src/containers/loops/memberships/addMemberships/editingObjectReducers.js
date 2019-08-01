import { ACTION_TYPES } from './actions';

export default {
  [ACTION_TYPES.addInviteeRow]: (state, action) => {
    const editingObjectId = action.payload;
    const updatedState = { ...state };
    const updatedEditingObject = { ...state[editingObjectId] };
    const updatedInvitees = state[editingObjectId].invitees.slice(0);
    
    updatedInvitees.push({ firstName: '', lastName: '', email: '' });
    updatedEditingObject.invitees = updatedInvitees;
    updatedState[editingObjectId] = updatedEditingObject;
    
    return updatedState;
  }
};