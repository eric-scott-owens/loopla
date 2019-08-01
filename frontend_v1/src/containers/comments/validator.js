import BaseValidator from '../../validators/BaseValidator';
import RichTextFieldValidator from '../../validators/field-validators/RichTextFieldValidator';
import PhotoCollectionValidator from '../../validators/field-validators/PhotoCollectionValidator';
import { Comment as validationConfig } from '../../validators/configuration';
import configuration from '../../configuration';
import TextFieldValidator from '../../validators/field-validators/TextFieldValidator';
import TagFieldValidator from '../../validators/field-validators/TagFieldValidator';
import PlaceFieldValidator from '../../validators/field-validators/PlaceFieldValidator';
import CategoryFieldValidator from '../../validators/field-validators/CategoryFieldValidator';

export default class CommentValidator extends BaseValidator {
  constructor() {
    super();
    const locale = BaseValidator.getLocale();
    
    this.photosValidator = new PhotoCollectionValidator({
      fieldName: 'photoCollections[0]',
      locale,
      ...validationConfig.photos
    });
    this.tagsValidator = new TagFieldValidator({
      fieldName: 'Tags',
      locale
    });
    this.placesValidator = new PlaceFieldValidator({
      fieldName: "Places",
      locale
    });
    this.categoriesValidator = new CategoryFieldValidator({
      fieldName: 'Categories',
      locale
    });

    if(configuration.enableRichTextEditing) {
      this.textValidator = new RichTextFieldValidator({
        fieldName: 'Body',
        locale,
        ...validationConfig.text
      });
    } else {
      this.textValidator = new TextFieldValidator({
        fieldName: 'Body',
        locale,
        ...validationConfig.text
      })
    }
  }

  startFieldValidators = (comment) => {
    this.addFieldValidationPromise('text', this.textValidator.validate(comment.text));
    this.addFieldValidationPromise('photoCollections[0]', this.photosValidator.validate(comment.photoCollections[0].photoCollectionPhotos));
    this.addFieldValidationPromise('tags', this.tagsValidator.validate(comment[configuration.internalFieldNames.NEW_PLACE_NAME], comment.tags));
    this.addFieldValidationPromise('categories', this.categoriesValidator.validate(comment[configuration.internalFieldNames.NEW_CATEGORY_NAME], comment.categories));
    this.addFieldValidationPromise('places', this.placesValidator.validate(comment[configuration.internalFieldNames.NEW_PLACE_NAME], comment.places));
  }
}
