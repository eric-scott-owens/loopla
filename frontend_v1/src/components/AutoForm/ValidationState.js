export const VALIDATION_PROCESSING_STATE = {
  initial: 'VALIDATION-PROCESSING-INITIAL',
  complete: 'VALIDATION-PROCESSING-COMPLETE',
  pending: 'VALIDATION-PROCESSING-PENDING',
  error: 'VALIDATION-PROCESSING-ERROR',
}

export default class ValidationState {

  validationProcessingState = VALIDATION_PROCESSING_STATE.initial;

  validationResult = null;
  
}
