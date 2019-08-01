import * as fetchResourceActions from '../actions/fetchResource';
import { getTableNameForModelType } from '../utilities/ObjectUtilities';

// eslint-disable-next-line
export function deleteResourceReducer(state, action) {
  if(
    action.type === fetchResourceActions.ACTION_TYPES.complete &&
    action.httpVerb === 'DELETE'
  ) {
    const { resourceType, resourceId } = action;
    const tableName = getTableNameForModelType(resourceType);
    const updatedTable = {...state[tableName]};

    delete updatedTable[resourceId];

    return {
      ...state,
      [tableName]: updatedTable
    };
  }

  return state;
}
