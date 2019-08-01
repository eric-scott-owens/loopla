import BaseValidator from '../../../validators/BaseValidator';
import NumberValidator from '../../../validators/field-validators/NumberValidator';
import { User as validationConfig } from '../../../validators/configuration';

export default class UsernameFormValidator extends BaseValidator {
  constructor() {
    super();
    const locale = BaseValidator.getLocale();
    this.phoneNumberValidator = 
      new NumberValidator({
        fieldName: 'Cell phone number',
        locale,
        ...validationConfig.telephoneNumber
      });
  }

  startFieldValidators(formData) {
    // ensure the username is a valid username
    this.addFieldValidationPromise('telephoneNumber', this.phoneNumberValidator.validate(formData.telephoneNumber));
  }
}