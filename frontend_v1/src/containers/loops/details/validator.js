import BaseValidator from '../../../validators/BaseValidator';
import TextFieldValidator from '../../../validators/field-validators/TextFieldValidator';
import { Loop as validationConfig } from '../../../validators/configuration';

export default class LoopValidator extends BaseValidator {
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
    this.guidelinesValidator = 
      new TextFieldValidator({
        fieldName: 'Guidelines',
        locale,
        ...validationConfig.circle.guidelines
      });
    this.cityValidator = 
      new TextFieldValidator({
        fieldName: 'City',
        locale,
        ...validationConfig.circle.city
      });
    this.stateValidator = 
      new TextFieldValidator({
        fieldName: 'State',
        locale,
        ...validationConfig.circle.state
      });
  }

  startFieldValidators(loop) {
    this.addFieldValidationPromise('circle.name', this.nameValidator.validate(loop.circle.name));
    this.addFieldValidationPromise('circle.description', this.descriptionValidator.validate(loop.circle.description));
    this.addFieldValidationPromise('circle.guidelinesValidator', this.guidelinesValidator.validate(loop.circle.guidelinesValidator));
    this.addFieldValidationPromise('circle.city', this.cityValidator.validate(loop.circle.city));
    this.addFieldValidationPromise('circle.state', this.stateValidator.validate(loop.circle.state));
  }
}