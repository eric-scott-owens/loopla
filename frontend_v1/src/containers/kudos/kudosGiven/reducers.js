import { handleActions } from 'redux-actions';
import { ACTION_TYPES as actionTypes } from './actions';
import { getTableNameForModelType } from '../../../utilities/ObjectUtilities';
import { capitalizeFirstLetter } from '../../../utilities/StringUtilities';


const initialState = {}; // Dictionary indexed by id

export function process(state, kudosGiven) {
  const updatedState = {...state};
  updatedState[kudosGiven.id] = kudosGiven;

  return updatedState;
}

export const reducers = handleActions({
  [actionTypes.single.set]: (state, action) => {
    const newState = process(state, action.payload);
    return newState;
  },
  [actionTypes.reset]: () => (initialState)
}, initialState);

export const globalReducers = handleActions({
  [actionTypes.eventReceivers.kudosGiven]: (state, action) => {
    // Add the KudosGiven object the the updated state
    const updatedState = {...state};
    const kudosGiven = action.payload;
    updatedState.kudosGiven = process(updatedState.kudosGiven, kudosGiven);
    
    // Add the reference to the kudos given to the thing it was given to
    const clientSideKudosGiven = updatedState.kudosGiven[kudosGiven.id];
    const contentTypeTableName = getTableNameForModelType(capitalizeFirstLetter(clientSideKudosGiven.contentType));
    const contentTypeTable = {...updatedState[contentTypeTableName]};
    const thingGivenKudos = {...contentTypeTable[clientSideKudosGiven.objectId]};

    thingGivenKudos.kudosReceived = thingGivenKudos.kudosReceived.slice();
    thingGivenKudos.kudosReceived.push(kudosGiven.id);
    contentTypeTable[clientSideKudosGiven.objectId] = thingGivenKudos;
    updatedState[contentTypeTableName] = contentTypeTable;

    return updatedState;
  }
}, 
// Initializer
{});