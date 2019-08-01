import forEach from 'lodash/forEach';
import BaseValidator from '../../../../validators/BaseValidator';
import TextFieldValidator from '../../../../validators/field-validators/TextFieldValidator';
import EmailFieldValidator from '../../../../validators/field-validators/EmailFieldValidator';

export default class AddMemberFormValidator extends BaseValidator {
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
    forEach(formData.invitees, (invitee, index) => { 
      this.addFieldValidationPromise(`invitees[${index}]firstName`, this.firstNameValidator.validate(invitee.firstName));
      this.addFieldValidationPromise(`invitees[${index}]lastName`, this.lastNameValidator.validate(invitee.lastName));
      this.addFieldValidationPromise(`invitees[${index}]email`, this.emailValidator.validate(invitee.email));
    });
  }
}