import TextFieldValidator from '../../../validators/field-validators/TextFieldValidator';
import NumberValidator from '../../../validators/field-validators/NumberValidator';
import EmailFieldValidator from '../../../validators/field-validators/EmailFieldValidator';
import BaseValidator from '../../../validators/BaseValidator';
import { User as validationConfig } from '../../../validators/configuration';


export default class UserValidator extends BaseValidator{
  constructor() {
    super();
    const locale = BaseValidator.getLocale();

    this.firstNameValidator = 
      new TextFieldValidator({
        fieldName: 'firstName', 
        locale,
        ...validationConfig.firstName
      });
    this.middleNameValidator =
      new TextFieldValidator({
        fieldName: 'middleName',
        locale,
        ...validationConfig.middleName
      });
    this.lastNameValidator =
      new TextFieldValidator({
        fieldName: 'lastName',
        locale,
        ...validationConfig.lastName
      });
    this.phoneNumberValidator = 
      new NumberValidator({
        fieldName: 'telephoneNumber',
        locale,
        ...validationConfig.telephoneNumber
      });
    this.emailValidator = 
      new EmailFieldValidator({
        fieldName: 'email',
        locale,
        ...validationConfig.email
      });
    this.addressLine1Validator =
      new TextFieldValidator({
        fieldName: 'Line 1',
        locale,
        ...validationConfig.addressLine1
      });
    this.addressLine2Validator =
      new TextFieldValidator({
        fieldName: 'Line 2',
        locale,
        ...validationConfig.addressLine2
      });
    this.addressLine3Validator =
      new TextFieldValidator({
        fieldName: 'Line 3',
        locale,
        ...validationConfig.addressLine3
      });
    this.cityValidator = 
      new TextFieldValidator({
        fieldName: 'city', 
        locale,
        ...validationConfig.city
      });
    this.stateValidator =
      new TextFieldValidator({
        fieldName: 'state',
        locale,
        ...validationConfig.state
      });
    this.zipcodeValidator =
      new NumberValidator({
        fieldName: 'zipcode',
        locale,
        ...validationConfig.zipcode
      });
    this.biographyValidator =
      new TextFieldValidator({
        fieldName: 'biography', 
        locale,
        ...validationConfig.biography
      });

  }

  startFieldValidators = (user) => {
    this.addFieldValidationPromise('firstName', this.firstNameValidator.validate(user.firstName));
    this.addFieldValidationPromise('middleName', this.middleNameValidator.validate(user.middleName));
    this.addFieldValidationPromise('lastName', this.lastNameValidator.validate(user.lastName));
    this.addFieldValidationPromise('telephoneNumber', this.phoneNumberValidator.validate(user.telephoneNumber));
    this.addFieldValidationPromise('email', this.emailValidator.validate(user.email));
    this.addFieldValidationPromise('addressLine1', this.addressLine1Validator.validate(user.addressLine1));
    this.addFieldValidationPromise('addressLine2', this.addressLine2Validator.validate(user.addressLine2));
    this.addFieldValidationPromise('addressLine3', this.addressLine3Validator.validate(user.addressLine3));
    this.addFieldValidationPromise('city', this.cityValidator.validate(user.city));
    this.addFieldValidationPromise('state', this.stateValidator.validate(user.state));
    this.addFieldValidationPromise('zipcode', this.zipcodeValidator.validate(user.zipcode));
    this.addFieldValidationPromise('biography', this.biographyValidator.validate(user.biography));
  }
}