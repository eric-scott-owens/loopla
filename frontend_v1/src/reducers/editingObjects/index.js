import { handleActions } from 'redux-actions';
import editingObjectBaseReducers from './editingObjects';
import addLoopMemberReducers from '../../containers/loops/memberships/addMemberships/editingObjectReducers';

// eslint-disable-next-line
export const reducers = handleActions({
  ...editingObjectBaseReducers,
  ...addLoopMemberReducers
}, {});