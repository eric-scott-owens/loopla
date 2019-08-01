import BaseValidator from '../../validators/BaseValidator';
import TextFieldValidator from '../../validators/field-validators/TextFieldValidator';
import PhotoCollectionValidator from '../../validators/field-validators/PhotoCollectionValidator';
import { Feedback as validationConfig } from '../../validators/configuration';


export default class FeedbackValidator extends BaseValidator {
  constructor() {
    super();
    const locale = BaseValidator.getLocale();
    
    this.textValidator = 
      new TextFieldValidator({
        fieldName: 'Text', 
        locale,
        ...validationConfig.text
      });

    this.photosValidator = 
      new PhotoCollectionValidator({
        fieldName: 'photoCollections[0]',
        locale,
        ...validationConfig.photos
      });
    
  }

  startFieldValidators = (feedback) => {
    this.addFieldValidationPromise('text', this.textValidator.validate(feedback.text));
    this.addFieldValidationPromise('photoCollections[0]', this.photosValidator.validate(feedback.photoCollections[0].photoCollectionPhotos));
  }
}
