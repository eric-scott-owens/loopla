import validator from 'validator';
import BaseFieldValidator from './BaseFieldValidator';
import { capitalizeFirstLetter } from '../../utilities/StringUtilities';

export default class EmailFieldValidator extends BaseFieldValidator {
  constructor({fieldName, locale, isRequired}) {
    super({fieldName, locale});
    this.isRequired = isRequired;
    this.maxLength = 255;
    
    // Set interjections
    this.interjections = {
      required: capitalizeFirstLetter(BaseFieldValidator.getRandomInterjection()),
      maxLength: capitalizeFirstLetter(BaseFieldValidator.getRandomInterjection()),
      isEmail: capitalizeFirstLetter(BaseFieldValidator.getRandomInterjection()),
    }
  }
  
  // If validation fails to process for any reason 
  // we wil reject the validation promise and block any chance of allowing
  // validation to complete.
  async validate(text) {
    const validationErrorMessages = [];

    if(text && !validator.isEmail(text)) {
      validationErrorMessages.push(`${this.interjections.isEmail}! This doesn't look quite right.`);
    }
    
    // Add any applicable validation messages
    if(this.isRequired === true) {
      if(!text || validator.isEmpty(text, { ignore_whitespace: true })) {
        validationErrorMessages.push(`${this.interjections.required}! ${this.fieldName} is required.`);
      }
    }

    if(this.maxLength > 0) {
      if(text && text.length > this.maxLength) {
        validationErrorMessages.push(`${this.interjections.maxLength}! Only ${this.maxLength} characters allowed.`);
      }
    }

    // So long as we successfully finished validating, we resolve
    // with any error messages included in the resolution
    return validationErrorMessages;
  }
}