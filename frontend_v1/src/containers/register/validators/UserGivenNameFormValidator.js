import BaseValidator from '../../../validators/BaseValidator';
import TextFieldValidator from '../../../validators/field-validators/TextFieldValidator';
import { User as validationConfig } from '../../../validators/configuration';

export default class UsernameFormValidator extends BaseValidator {
  constructor() {
    super();
    const locale = BaseValidator.getLocale();
    this.firstNameValidator = new TextFieldValidator({
      fieldName: 'First Name',
      locale,
      ...validationConfig.firstName
    });
    this.middleNameValidator = new TextFieldValidator({
      fieldName: 'Middle Name',
      locale,
      ...validationConfig.middleName
    });
    this.lastNameValidator = new TextFieldValidator({
      fieldName: 'Last Name',
      locale,
      ...validationConfig.lastName
    })
  }

  startFieldValidators(formData) {
    // ensure the username is a valid username
    this.addFieldValidationPromise('firstName', this.firstNameValidator.validate(formData.firstName));
    this.addFieldValidationPromise('middleName', this.middleNameValidator.validate(formData.middleName));
    this.addFieldValidationPromise('lastName', this.lastNameValidator.validate(formData.lastName));
  }
}