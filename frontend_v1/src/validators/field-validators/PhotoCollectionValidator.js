import BaseFieldValidator from './BaseFieldValidator';
import TextFieldValidator from './TextFieldValidator';
import { capitalizeFirstLetter } from '../../utilities/StringUtilities';

export const ERROR_TYPES = {
  general: 'general',
  caption: 'caption'
};

export default class PhotoCollectionValidator extends BaseFieldValidator {
  constructor({fieldName, locale, isRequired, areCaptionsRequired}) {
    super({fieldName, locale});
    this.isRequired = isRequired;
    this.captionValidator 
      = new TextFieldValidator({
        fieldName: 'Caption',
        locale,
        maxLength: 60,
        isRequired: areCaptionsRequired
      });

    this.interjections = {
      required: capitalizeFirstLetter(BaseFieldValidator.getRandomInterjection()),
      generalCaption: capitalizeFirstLetter(BaseFieldValidator.getRandomInterjection()),
    }
  }
  
  // If validation fails to process for any reason 
  // we wil reject the validation promise and block any chance of allowing
  // validation to complete.
  async validate(photos) {
    const validationErrorMessages = [];

    // Add any applicable validation messages
    if(this.isRequired) {
      if(!photos || !(photos.length > 0)) {
        validationErrorMessages.push({
          errorType: ERROR_TYPES.general,
          errorMessage: `${this.interjections.required}! ${this.fieldName} requires at least one photo.`
        });
      }
    }

    // Validate captions
    let hasCaptionError = false;
    const { captionValidator } = this;
    const captionValidationPromises = photos.map(p => p.photo.caption).map(c => captionValidator.validate(c));
    const captionValidationResults = await Promise.all(captionValidationPromises);

    captionValidationResults.forEach((errors, photoIndex) => {
      errors.forEach((errorMessage) => {
        hasCaptionError = true;
        validationErrorMessages.push({
          errorType: ERROR_TYPES.caption,
          photoIndex,
          errorMessage
        });
      });
    });

    if(hasCaptionError) {
      validationErrorMessages.push({
        errorType: ERROR_TYPES.general,
        errorMessage: `${this.interjections.generalCaption}! One or more captions have validation errors`
      })
    }
    
    // So long as we successfully finished validating, we resolve
    // with any error messages included in the resolution
    return validationErrorMessages;
  }
}