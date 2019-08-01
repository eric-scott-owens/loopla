import BaseValidator from '../../../../../validators/BaseValidator';
import ChangeStatusTypeFieldValidator from './ChangeStatusTypeFieldValidator';

export default class ChangeMembershipStatusFormValidator extends BaseValidator {
  constructor() {
    super();
    const locale = BaseValidator.getLocale();
    this.changeStatusTypeValidator = 
      new ChangeStatusTypeFieldValidator({
        fieldName: 'Change Status Type',
        locale
      })
  }

  startFieldValidators(formData, state) {
    this.addFieldValidationPromise('changeStatusType', this.changeStatusTypeValidator.validate(formData, state));  
  }
}