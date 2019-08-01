export const ACTION_TYPES = {
  validateObject: 'VALIDATE-OBJECT',
  validationInitialized: 'VALIDATION-INITIALIZED',
  validationPending: 'VALIDATION-PENDING',
  validationError: 'VALIDATION-ERROR',
  validationComplete: 'VALIDATION-COMPLETE',
  removeValidation: 'REMOVE-VALIDATION'
}

export const validate = (dataType, editingObjectId, validator) => ({
  type: ACTION_TYPES.validateObject,
  dataType,
  editingObjectId,
  validator
});

export const validationPending = (dataType, editingObjectId) => ({
  type: ACTION_TYPES.validationPending,
  dataType,
  editingObjectId
});

export const validationError = (dataType, editingObjectId, error) => ({
  type: ACTION_TYPES.validationError,
  dataType,
  editingObjectId,
  error
});

export const validationComplete = (dataType, editingObjectId, validationResult) => ({
  type: ACTION_TYPES.validationComplete,
  dataType,
  editingObjectId,
  validationResult
});

export const removeValidation = (editingObjectId) => ({
  type: ACTION_TYPES.removeValidation,
  editingObjectId
});