import { ACTION_TYPES } from './ACTION_TYPES';

// PLACE ACTIONS
export const addPlaceToEditingObject = (editingObjectId, place) => ({
  type: ACTION_TYPES.place.add,
  editingObjectId,
  place
});

export const deletePlaceFromEditingObject = (editingObjectId, place) => ({
  type: ACTION_TYPES.place.delete,
  editingObjectId,
  place
});