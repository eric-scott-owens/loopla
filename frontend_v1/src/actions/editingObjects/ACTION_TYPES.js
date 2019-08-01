// Not exported as default so that we can easily re-export
// with our desired name in index.js

// eslint-disable-next-line
export const ACTION_TYPES = {
  add: 'ADD-EDITING-OBJECT',
  updateField: 'UPDATE-EDITING-OBJECT-FIELD',
  remove: 'REMOVE-EDITING-OBJECT',
  deleteProperty: 'DELETE-EDITING-OBJECT-PROPERTY',
  removeItemFromEditingObjectArray: 'REMOVE-ITEM-FROM-EDITING-OBJECT-ARRAY',
  removeItemFromEditingObjectArrayByIndex: 'REMOVE-ITEM-FROM-EDITING-OBJECT-ARRAY-BY-INDEX',
  pushValueToEditingObjectArray: 'PUSH-VALUE-TO-EDITING-OBJECT-ARRAY',
  startEditing: 'START-EDITING-EDITING-OBJECT',
  stopEditing: 'STOP-EDITING-EDITING-OBJECT',

  getSuggestedMetadata: 'GET-SUGGESTED-METADATA',
  addSuggestedMetadata: 'ADD-SUGGESTED-METADATA',

  tag: {
    add: 'ADD-TAG-TO-EDITING-OBJECT',
    addSuggested: 'ADD-SUGGESTED-TAGS-TO-EDITING-OBJECT',
    delete: 'DELETE-TAG-FROM-EDITING-OBJECT'
  }, 

  category: {
    add: 'ADD-CATEGORY-TO-EDITING-OBJECT',
    addSuggested: 'ADD-SUGGESTED-CATEGORIES-TO-EDITING-OBJECT',
    delete: 'DELETE-CATEGORY-FROM-EDITING-OBJECT'
  }, 

  place: {
    add: 'ADD-PLACE-TO-EDITING-OBJECT',
    delete: 'DELETE-PLACE-FROM-EDITING-OBJECT'
  },

  comment: {
    stopEditingAll: 'STOP-EDITING-ALL-COMMENTS',
    enableAllNew: 'ENABLE-EDITING-ALL-NEW-COMMENTS'
  }
};