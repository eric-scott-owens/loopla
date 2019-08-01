import forEach from 'lodash/forEach';
import uuidv1 from 'uuid';
import configuration from '../configuration';

export default function BaseValidator() {

  const validatorId = uuidv1();

  let inFlightValidationPromises = [];

  const resetValidator = async () => {
    inFlightValidationPromises = [];
  };

  this.getValidatorId = () => validatorId;

  this.addFieldValidationPromise = (fieldPath, fieldValidatorPromise) => {
    // eslint-disable-next-line
    fieldValidatorPromise[configuration.internalFieldNames.VALUE_PATH] = fieldPath;
    inFlightValidationPromises.push(fieldValidatorPromise);
  }

  const generateValidationState = async () => {
    const validationResults = await Promise.all(inFlightValidationPromises);
    const validationState = { isValid: true, validatorId }
    forEach(validationResults, (result, index) => {
      const valuePath = inFlightValidationPromises[index][configuration.internalFieldNames.VALUE_PATH];
      validationState[valuePath] = result.slice(0);

      if(result.length > 0) {
        validationState.isValid = false;
      }
    });

    return validationState;
  }

  this.validate = async (data) => {
    if(!this.startFieldValidators) {
      throw new Error('ERROR: BaseValidator.startFieldValidators is not implemented. Validators inheriting from BaseValidator are required to implement this function.');
    }

    resetValidator();
    this.startFieldValidators(data);
    const validationState = await generateValidationState();
    return validationState;
  }

}

const locale = (navigator.languages && navigator.languages[0]) || navigator.language || navigator.userLanguage;
BaseValidator.getLocale = () => locale;
