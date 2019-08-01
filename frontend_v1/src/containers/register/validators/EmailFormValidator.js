import BaseValidator from '../../../validators/BaseValidator';
import RegisterEmailFieldValidator from './field-validators/RegisterEmailFieldValidator';

export default class EmailFormValidator extends BaseValidator {
  constructor() {
    super();
    const locale = BaseValidator.getLocale();
    this.emailValidator = new RegisterEmailFieldValidator({
      fieldName: 'email',
      locale
    })
  }

  startFieldValidators(formData) {
    // ensure the email is a valid email
    this.addFieldValidationPromise('email', this.emailValidator.validate(formData.email));
  }
}