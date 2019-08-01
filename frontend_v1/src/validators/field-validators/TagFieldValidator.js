import BaseFieldValidator from './BaseFieldValidator';
import TextFieldValidator from './TextFieldValidator';
import { capitalizeFirstLetter } from '../../utilities/StringUtilities';
import { getStore } from '../../containers/reduxStoreProvider';

export default class TagFieldValidator extends TextFieldValidator {
  constructor({fieldName, locale}) {
    super({
      fieldName, 
      locale, 
      isRequired: false, 
      maxLength: 200, 
      isAlphaNumeric: true
    });

    // Set interjections
    this.interjections = {
      ...this.interjections, // Merge interjections from TextFieldValidator
      tagAlreadyPresent: capitalizeFirstLetter(BaseFieldValidator.getRandomInterjection())
    }
  }
  
  // If validation fails to process for any reason 
  // we wil reject the validation promise and block any chance of allowing
  // validation to complete.
  async validate(tagName, selectedTags) {
    const validationErrorMessages = await super.validate(tagName);

    // Add validation warning if the tag already exists
    // in the collection of tags
    if(tagName) {
      const state = getStore().getState();
      const fullSelectedTags = (selectedTags || []).map(t => t.id ? t : state.tags[t]);
      const matchingTags = fullSelectedTags.filter(t => t.name.toLowerCase() === tagName.toLowerCase());
      if(matchingTags.length > 0) {
        validationErrorMessages.push(`${this.interjections.tagAlreadyPresent}! ${tagName} is already added.`);
      }
    }

    // So long as we successfully finished validating, we resolve
    // with any error messages included in the resolution
    return validationErrorMessages;
  }
}