import BaseValidator from '../../../validators/BaseValidator';
import RegisterPasswordFieldValidator from './field-validators/RegisterPasswordFieldValidator';

export default class PasswordFormValidator extends BaseValidator {
  constructor() {
    super();
    const locale = BaseValidator.getLocale();
    this.passwordValidator = new RegisterPasswordFieldValidator({
      fieldName: 'password',
      locale
    })
  }

  startFieldValidators(formData) {
    // ensure the password is a valid password
    this.addFieldValidationPromise('password', this.passwordValidator.validate(formData.password));
  }
}