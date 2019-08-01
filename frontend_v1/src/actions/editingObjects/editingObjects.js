import { createAction } from 'redux-actions';
import { ACTION_TYPES } from './ACTION_TYPES';

// OBJECT ACTIONS 
export const addEditingObject = createAction(ACTION_TYPES.add);
export const removeEditingObject = createAction(ACTION_TYPES.remove);

export const updateEditingObjectField = (editingObjectId, fieldName, fieldValue) => ({
  type: ACTION_TYPES.updateField,
  editingObjectId,
  fieldName,
  fieldValue
});

export const deleteEditingObjectProperty = (editingObjectId, propertyPath) => ({
  type: ACTION_TYPES.deleteProperty,
  editingObjectId,
  propertyPath
});

export const removeItemFromEditingObjectArray = (editingObjectId, arrayPropertyPath, itemIndex) => ({
  type: ACTION_TYPES.removeItemFromEditingObjectArray,
  editingObjectId,
  arrayPropertyPath,
  itemIndex
});

export const removeItemFromEditingObjectArrayByIndex = (editingObjectId, arrayPropertyPath, itemIndex) => ({
  type: ACTION_TYPES.removeItemFromEditingObjectArrayByIndex,
  editingObjectId,
  arrayPropertyPath,
  itemIndex
});

export const pushValueToEditingObjectArray = (editingObjectId, arrayPropertyPath, value) => ({
  type: ACTION_TYPES.pushValueToEditingObjectArray,
  editingObjectId,
  arrayPropertyPath,
  value
});
// Marks the specified editing object as active for editing
export const startEditing = (editingObjectId) => ({
  type: ACTION_TYPES.startEditing,
  editingObjectId
})

// Marks the specified editing object as NOT active for editing
export const stopEditing = (editingObjectId) => ({
  type: ACTION_TYPES.stopEditing,
  editingObjectId
})
