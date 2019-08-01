import BaseFieldValidator from '../../../../validators/field-validators/BaseFieldValidator';
import EmailFieldValidator from '../../../../validators/field-validators/EmailFieldValidator';
import { capitalizeFirstLetter } from '../../../../utilities/StringUtilities';
import * as registrationActions from '../../actions';
import { User as validationConfig } from '../../../../validators/configuration';
import { getStore } from '../../../reduxStoreProvider';

export default class RegisterEmailFieldValidator extends EmailFieldValidator {
  constructor({fieldName, locale}) {
    super({fieldName, locale, ...validationConfig.email});
    this.interjections.isRegistered = capitalizeFirstLetter(BaseFieldValidator.getRandomInterjection());
    this.checkedEmails = {};
  }

  async validate(text) {
    const validationErrorMessages = await super.validate(text);

    // If the email is syntactically valid,
    // ensure the email is not already registered
    if(validationErrorMessages.length === 0) {
      // Check pre-cached results
      let isEmailRegistered = this.checkedEmails[text.toLowerCase()];
      if(isEmailRegistered === undefined) {
        // Check against the server
        isEmailRegistered = await getStore().dispatch(registrationActions.isEmailRegistered(text));
      }
      
      // and updated the pre-cached results
      this.checkedEmails[text.toLowerCase()] = isEmailRegistered;

      if(isEmailRegistered) {
        // The username is already registered, add a validation error
        validationErrorMessages.push(`${this.interjections.isRegistered}! This email is already registered.`);
      }
    }

    return validationErrorMessages;
  }
}