import { handleActions } from 'redux-actions';
import { ACTION_TYPES } from './actions';

// eslint-disable-next-line
export const globallyScopedReducers = handleActions({
  [ACTION_TYPES.updateTakenTours]: (state, action) => {
    const { currentUserId } = state;
    const updatedState = {...state};
    const updatedUsers = {...updatedState.users};
    const updatedCurrentUser = {...updatedUsers[currentUserId]};
    const updatedToursTaken = {...updatedCurrentUser.toursTaken}
    
    // Mark the tour as taken
    updatedToursTaken[action.payload] = true;

    // Merge up the changes into the state
    updatedCurrentUser.toursTaken = updatedToursTaken;
    updatedUsers[currentUserId] = updatedCurrentUser;
    updatedState.users = updatedUsers;
    
    // Return the updated state object
    return updatedState;
  }
}, null);