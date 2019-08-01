import validator from 'validator';
import BaseFieldValidator from './BaseFieldValidator';
import { capitalizeFirstLetter, onlyUses } from '../../utilities/StringUtilities';

export default class TextFieldValidator extends BaseFieldValidator {
  constructor({fieldName, locale, isRequired, maxLength, minLength, isAlphaNumeric, isNumeric, allowedCharacters}) {
    super({fieldName, locale});
    this.isRequired = isRequired;
    this.maxLength = maxLength;
    this.minLength = minLength;
    this.isAlphaNumeric = isAlphaNumeric;
    this.isNumeric = isNumeric;
    this.allowedCharacters = allowedCharacters;

    // Set interjections
    this.interjections = {
      required: capitalizeFirstLetter(BaseFieldValidator.getRandomInterjection()),
      maxLength: capitalizeFirstLetter(BaseFieldValidator.getRandomInterjection()),
      minLength: capitalizeFirstLetter(BaseFieldValidator.getRandomInterjection()),
      isAlphaNumeric: capitalizeFirstLetter(BaseFieldValidator.getRandomInterjection()),
      isNumeric: capitalizeFirstLetter(BaseFieldValidator.getRandomInterjection()),
      allowedCharacters: capitalizeFirstLetter(BaseFieldValidator.getRandomInterjection())
    }
  }
  
  // If validation fails to process for any reason 
  // we wil reject the validation promise and block any chance of allowing
  // validation to complete.
  async validate(text) {
    const validationErrorMessages = [];

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

    if(this.minLength > 0) {
      if(text && text.length < this.minLength) {
        validationErrorMessages.push(`${this.interjections.minLength}! At least ${this.minLength} characters are required.`);
      }
    }

    if(this.isAlphaNumeric === true) {
      if(text && !validator.isAlphanumeric(text)) {
        validationErrorMessages.push(`${this.interjections.isAlphaNumeric}! Use letters and numbers only. No spaces allowed.`);
      }
    }

    if(this.isNumeric === true) {
      if(text && !validator.isNumeric(text)) {
        validationErrorMessages.push(`${this.interjections.isNumeric}! Only numbers allowed.`);
      }
    }

    if(this.allowedCharacters && this.allowedCharacters.length > 0) {
      if(!onlyUses(text, this.allowedCharacters)) {
        validationErrorMessages.push(`${this.interjections.allowedCharacters}! Character not allowed.`)
      }
    }

    // So long as we successfully finished validating, we resolve
    // with any error messages included in the resolution
    return validationErrorMessages;
  }
}