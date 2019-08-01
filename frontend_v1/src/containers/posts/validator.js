import BaseValidator from '../../validators/BaseValidator';
import TextFieldValidator from '../../validators/field-validators/TextFieldValidator';
import RichTextFieldValidator from '../../validators/field-validators/RichTextFieldValidator';
import NumberValidator from '../../validators/field-validators/NumberValidator';
import PhotoCollectionValidator from '../../validators/field-validators/PhotoCollectionValidator';
import TagFieldValidator from '../../validators/field-validators/TagFieldValidator';
import PlaceFieldValidator from '../../validators/field-validators/PlaceFieldValidator';
import CategoryFieldValidator from '../../validators/field-validators/CategoryFieldValidator';
import { Post as validationConfig } from '../../validators/configuration';
import configuration from '../../configuration';


export default class PostValidator extends BaseValidator {
  constructor() {
    super();
    const locale = BaseValidator.getLocale();
    
    this.summaryValidator =
      new TextFieldValidator({
        fieldName: 'Summary',
        locale,
        ...validationConfig.summary
      });
    this.loopValidator = 
      new NumberValidator({
        fieldName: 'Loop',
        locale,
        ...validationConfig.loop
      });
    this.photosValidator = 
      new PhotoCollectionValidator({
        fieldName: 'photoCollections[0]',
        locale,
        ...validationConfig.photos
      });
    this.tagsValidator = 
      new TagFieldValidator({
        fieldName: 'Tags',
        locale
      });
    this.placesValidator = 
      new PlaceFieldValidator({
        fieldName: "Places",
        locale
      });
    this.categoriesValidator = 
      new CategoryFieldValidator({
        fieldName: 'Categories',
        locale
      })

    if(configuration.enableRichTextEditing) {
      this.textValidator = 
        new RichTextFieldValidator({
          fieldName: 'Body', 
          locale,
          ...validationConfig.text
        });
    } else {
      this.textValidator = 
        new TextFieldValidator({
          fieldName: 'Body',
          locale,
          ...validationConfig.text
        })
    }
  }

  startFieldValidators = (post) => {
    this.addFieldValidationPromise('summary', this.summaryValidator.validate(post.summary));
    this.addFieldValidationPromise('text', this.textValidator.validate(post.text));
    this.addFieldValidationPromise('groupId', this.loopValidator.validate(post.groupId));
    this.addFieldValidationPromise('photoCollections[0]', this.photosValidator.validate(post.photoCollections[0].photoCollectionPhotos));
    this.addFieldValidationPromise('tags', this.tagsValidator.validate(post[configuration.internalFieldNames.NEW_PLACE_NAME], post.tags));
    this.addFieldValidationPromise('categories', this.categoriesValidator.validate(post[configuration.internalFieldNames.NEW_CATEGORY_NAME], post.categories));
    this.addFieldValidationPromise('places', this.placesValidator.validate(post[configuration.internalFieldNames.NEW_PLACE_NAME], post.places));
  }
}
