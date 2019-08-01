import { ACTION_TYPES} from './ACTION_TYPES';

// CATEGORY ACTIONS
export const addCategoryToEditingObject = (editingObjectId, category) => ({
  type: ACTION_TYPES.category.add,
  editingObjectId,
  category
});

export const addSuggestedCategoriesToEditingObject = (editingObjectId, categoryIds) => ({
  type: ACTION_TYPES.category.addSuggested,
  editingObjectId,
  categoryIds
});

export const deleteCategoryFromEditingObject = (editingObjectId, category) => ({
  type: ACTION_TYPES.category.delete,
  editingObjectId,
  category
});
