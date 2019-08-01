import { ACTION_TYPES } from './ACTION_TYPES';

// TAG ACTIONS 
export const addTagToEditingObject = (editingObjectId, tag) => ({
  type: ACTION_TYPES.tag.add,
  editingObjectId,
  tag
});

export const deleteTagFromEditingObject = (editingObjectId, tag) => ({
  type: ACTION_TYPES.tag.delete,
  editingObjectId,
  tag
});
