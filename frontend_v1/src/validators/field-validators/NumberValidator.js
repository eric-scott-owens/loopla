import BaseFieldValidator from './BaseFieldValidator';
import { capitalizeFirstLetter } from '../../utilities/StringUtilities';

export default class NumberValidator extends BaseFieldValidator {
  constructor({fieldName, locale, isRequired, max, min, isInteger}) {
    super({fieldName, locale});
    this.isRequired = isRequired;
    this.max = max;
    this.min = min;
    this.isInteger = isInteger;

    // Set interjections
    this.interjections = {
      required: capitalizeFirstLetter(BaseFieldValidator.getRandomInterjection()),
      notANumber: capitalizeFirstLetter(BaseFieldValidator.getRandomInterjection()),
      max: capitalizeFirstLetter(BaseFieldValidator.getRandomInterjection()),
      min: capitalizeFirstLetter(BaseFieldValidator.getRandomInterjection()),
      isInteger: capitalizeFirstLetter(BaseFieldValidator.getRandomInterjection())
    }
  }
  
  // If validation fails to process for any reason 
  // we wil reject the validation promise and block any chance of allowing
  // validation to complete.
  async validate(number) {
    const validationErrorMessages = [];

    // Add any applicable validation messages
    if(this.isRequired === true) {
      if(number === undefined || number === null) {
        validationErrorMessages.push(`${this.interjections.required}! ${this.fieldName} is required.`);
      }
    }

    if((number || number === 0) && isNaN(number)) {
      validationErrorMessages.push(`${this.interjections.notANumber}! ${this.fieldName} is not a number.`);
    }

    if((this.max || this.max === 0) && !isNaN(this.max) && (number || number === 0)) {
      if(number > this.max) {
        validationErrorMessages.push(`${this.interjections.max}! Cannot be more than ${this.max}.`);
      }
    }

    if((this.min || this.min === 0) && !isNaN(this.min) && (number || number === 0)) {
      if(number < this.min) {
        validationErrorMessages.push(`${this.interjections.min}! Cannot be less than ${this.min}.`);
      }
    }

    if(this.isInteger === true && (number || number === 0)) {
      if(!Number.isInteger(number)) {
        validationErrorMessages.push(`${this.interjections.isInteger}! Only whole numbers allowed.`);
      }
    }

    // So long as we successfully finished validating, we resolve
    // with any error messages included in the resolution
    return validationErrorMessages;
  }
}