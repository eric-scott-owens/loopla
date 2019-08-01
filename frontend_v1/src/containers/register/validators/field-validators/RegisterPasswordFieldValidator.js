import forEach from 'lodash/forEach';
import TextFieldValidator from '../../../../validators/field-validators/TextFieldValidator';
import BaseFieldValidator from '../../../../validators/field-validators/BaseFieldValidator';
import { capitalizeFirstLetter } from '../../../../utilities/StringUtilities';
import * as registrationActions from '../../actions';
import { User as validationConfig } from '../../../../validators/configuration';
import { getStore } from '../../../reduxStoreProvider';

export default class RegisterPasswordFieldValidator extends TextFieldValidator {
  constructor({fieldName, locale}) {
    super({fieldName, locale, ...validationConfig.password})
    this.interjections.serverValidation = capitalizeFirstLetter(BaseFieldValidator.getRandomInterjection());
    this.checkedPasswords = {};
  }

  async validate(text) {
    const validationErrorMessages = await super.validate(text);

    if(validationErrorMessages.length === 0) {
      // Check pre-cached server results
      let serverValidationErrors = this.checkedPasswords[text];
      if(serverValidationErrors === undefined) {
        // check against the server
        serverValidationErrors = await getStore().dispatch(registrationActions.validateNewPassword(text));

        // cache the results
        this.checkedPasswords[text] = serverValidationErrors;
      }

      // Add any validation errors to the return set
      if(serverValidationErrors && serverValidationErrors.length > 0) {
        forEach(serverValidationErrors, error => {
          validationErrorMessages.push(error);
        });
      }
    }

    return validationErrorMessages;
  }
}