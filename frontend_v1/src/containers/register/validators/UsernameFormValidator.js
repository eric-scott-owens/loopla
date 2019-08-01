import BaseValidator from '../../../validators/BaseValidator';
import RegisterUsernameFieldValidator from './field-validators/RegisterUsernameFieldValidator';

export default class UsernameFormValidator extends BaseValidator {
  constructor() {
    super();
    const locale = BaseValidator.getLocale();
    this.usernameValidator = new RegisterUsernameFieldValidator({
      fieldName: 'username',
      locale
    })
  }

  startFieldValidators(formData) {
    // ensure the username is a valid username
    this.addFieldValidationPromise('username', this.usernameValidator.validate(formData.username));
  }
}