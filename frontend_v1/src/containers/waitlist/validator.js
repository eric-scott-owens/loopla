import BaseValidator from '../../validators/BaseValidator';
import TextFieldValidator from '../../validators/field-validators/TextFieldValidator';
import EmailFieldValidator from '../../validators/field-validators/EmailFieldValidator';
import { Waitlist as validationConfig } from '../../validators/configuration';


export default class WaitlistValidator extends BaseValidator {
  constructor() {
    super();
    const locale = BaseValidator.getLocale();
    this.firstNameValidator = 
      new TextFieldValidator({
        fieldName: 'First name', 
        locale,
        ...validationConfig.firstName
      });
    this.lastNameValidator =
      new TextFieldValidator({
        fieldName: 'Last name',
        locale,
        ...validationConfig.lastName
      });
    this.emailValidator =
      new EmailFieldValidator({
        fieldName: 'Email',
        locale,
        ...validationConfig.email
      });
    this.commentValidator =
      new TextFieldValidator({
        fieldName: 'Comment',
        locale,
        ...validationConfig.comment
      });
    
  }

  startFieldValidators = (user) => {
    this.addFieldValidationPromise('firstName', this.firstNameValidator.validate(user.firstName));
    this.addFieldValidationPromise('lastName', this.lastNameValidator.validate(user.lastName));
    this.addFieldValidationPromise('email', this.emailValidator.validate(user.email));
    this.addFieldValidationPromise('comment', this.commentValidator.validate(user.comment));
  }
}
