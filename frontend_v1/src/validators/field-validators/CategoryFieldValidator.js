import BaseFieldValidator from './BaseFieldValidator';
import TextFieldValidator from './TextFieldValidator';
import { capitalizeFirstLetter } from '../../utilities/StringUtilities';

export default class CategoryFieldValidator extends TextFieldValidator {
  constructor({fieldName, locale}) {
    super({
      fieldName, 
      locale, 
      isRequired: false, 
      maxLength: 200
    });

    // Set interjections
    this.interjections = {
      ...this.interjections, // Merge interjections from TextFieldValidator
      categoryAlreadyPresent: capitalizeFirstLetter(BaseFieldValidator.getRandomInterjection())
    }
  }
  
  // If validation fails to process for any reason 
  // we wil reject the validation promise and block any chance of allowing
  // validation to complete.
  async validate(categoryName) {
    const validationErrorMessages = await super.validate(categoryName);

    // So long as we successfully finished validating, we resolve
    // with any error messages included in the resolution
    return validationErrorMessages;
  }
}