import values from 'lodash/values';
import filter from 'lodash/filter';
import BaseFieldValidator from '../../../../../validators/field-validators/BaseFieldValidator';
import StatusChangeOptionsEnum from '../StatusChangeOptionsEnum';
import { capitalizeFirstLetter } from '../../../../../utilities/StringUtilities';
  
export default class ChangeStatusTypeFieldValidator extends BaseFieldValidator {
  constructor({fieldName, locale }) {
    super({fieldName, locale});
    this.interjection = capitalizeFirstLetter(BaseFieldValidator.getRandomInterjection());
  }

  async validate(formData, state) {
    const validationErrorMessages = [];

    // Ensure we aren't trying to remove the last administrator
    if(
      formData.changeStatusType === StatusChangeOptionsEnum.ADMIN_TO_MEMBER
      || formData.changeStatusType === StatusChangeOptionsEnum.ADMIN_TO_INACTIVE
      || formData.changeStatusType === StatusChangeOptionsEnum.REMOVE_ADMIN
    ) {
      const memberships = values(state.memberships);
      const loopAdministratorMemberships = 
        filter(memberships, (membership) => (
          membership.groupId === formData.loopId
          && membership.isCoordinator === true
          && membership.isActive === true
        ));
  
      if(loopAdministratorMemberships.length === 1) {
        validationErrorMessages.push(`${this.interjection}! You cannot remove the last administrator in a loop.`);
      }
    }
  
    return validationErrorMessages;
  }
}