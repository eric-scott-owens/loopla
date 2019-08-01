import BaseValidator from '../../../validators/BaseValidator';
import TextFieldValidator from '../../../validators/field-validators/TextFieldValidator';
import { Loop as validationConfig } from '../../../validators/configuration';

export default class CreateLoopValidator extends BaseValidator {
  constructor() {
    super();
    const locale = BaseValidator.getLocale();
    this.nameValidator = 
      new TextFieldValidator({
        fieldName: 'Name',
        locale,
        ...validationConfig.name
      });
    this.descriptionValidator =
      new TextFieldValidator({
        fieldName: 'Description',
        locale,
        ...validationConfig.circle.description
      });
  }

  startFieldValidators(loop) {
    this.addFieldValidationPromise('circle.name', this.nameValidator.validate(loop.circle.name));
    this.addFieldValidationPromise('circle.description', this.descriptionValidator.validate(loop.circle.description));
  }
}