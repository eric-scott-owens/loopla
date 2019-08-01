import BaseValidator from '../../../../validators/BaseValidator';
import TextFieldValidator from '../../../../validators/field-validators/TextFieldValidator';
import EmailFieldValidator from '../../../../validators/field-validators/EmailFieldValidator';

export default class AddAdministratorFormValidator extends BaseValidator {
  constructor() {
    super();
    const locale = BaseValidator.getLocale();
    this.firstNameValidator = 
      new TextFieldValidator({
        fieldName: 'First Name',
        locale,
        isRequired: true,
        maxLength: 15
      });
    this.lastNameValidator = 
      new TextFieldValidator({
        fieldName: 'Last Name',
        locale,
        isRequired: true,
        maxLength: 20
      });
    this.emailValidator = 
      new EmailFieldValidator({
        fieldName: 'email',
        locale,
        isRequired: true
      })
  }

  startFieldValidators(formData) {
    this.addFieldValidationPromise(`invitee.firstName`, this.firstNameValidator.validate(formData.invitee.firstName));
    this.addFieldValidationPromise(`invitee.lastName`, this.lastNameValidator.validate(formData.invitee.lastName));
    this.addFieldValidationPromise(`invitee.email`, this.emailValidator.validate(formData.invitee.email));
  }
}