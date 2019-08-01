import BaseValidator from '../../../validators/BaseValidator';
import TextFieldValidator from '../../../validators/field-validators/TextFieldValidator';
import PasswordFieldValidator from '../../register/validators/field-validators/RegisterPasswordFieldValidator';
import { User as userValidationConfig } from '../../../validators/configuration'

export default class ChangePasswordFormValidator extends BaseValidator {
  constructor() {
    super();
    const locale = BaseValidator.getLocale();
    this.oldPasswordValidator = new TextFieldValidator({
      fieldName: 'Old Password',
      locale,
      ...userValidationConfig.password
    });
    this.newPasswordValidator = new PasswordFieldValidator({
      fieldName: 'New Password',
      locale
    });
  }

  startFieldValidators(formData) {
    this.addFieldValidationPromise('oldPassword', this.oldPasswordValidator.validate(formData.oldPassword));
    this.addFieldValidationPromise('newPassword', this.newPasswordValidator.validate(formData.newPassword));
    this.addFieldValidationPromise('retypePassword', (formData.newPassword === formData.retypePassword) ? [] : ['Passwords do not match.'] );
  }
}