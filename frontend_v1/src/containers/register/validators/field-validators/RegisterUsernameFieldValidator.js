import BaseFieldValidator from '../../../../validators/field-validators/BaseFieldValidator';
import TextFieldValidator from '../../../../validators/field-validators/TextFieldValidator';
import { capitalizeFirstLetter } from '../../../../utilities/StringUtilities';
import * as registrationActions from '../../actions';
import { User as validationConfig } from '../../../../validators/configuration';
import { getStore } from '../../../reduxStoreProvider';

export default class RegisterUsernameFieldValidator extends TextFieldValidator {
  constructor({fieldName, locale}) {
    super({fieldName, locale, ...validationConfig.username});
    this.interjections.isRegistered = capitalizeFirstLetter(BaseFieldValidator.getRandomInterjection());
    this.checkedUsernames = {};
  }

  async validate(text) {
    const validationErrorMessages = await super.validate(text);

    // If the username is syntactically valid,
    // ensure the username is not already registered
    if(validationErrorMessages.length === 0) {
      // Check pre-cached results
      let isUsernameRegistered = this.checkedUsernames[text.toLowerCase()];
      if(isUsernameRegistered === undefined) {
        // Check against the server
        isUsernameRegistered = await getStore().dispatch(registrationActions.isUsernameRegistered(text));
      }
      
      // and updated the pre-cached results
      this.checkedUsernames[text.toLowerCase()] = isUsernameRegistered;

      if(isUsernameRegistered) {
        // The username is already registered, add a validation error
        validationErrorMessages.push(`${this.interjections.isRegistered}! This username is already registered.`);
      } 
    }

    return validationErrorMessages;
  }
}