import BaseFieldValidator from './BaseFieldValidator';
import TextFieldValidator from './TextFieldValidator';
import { capitalizeFirstLetter } from '../../utilities/StringUtilities';

export default class PlaceFieldValidator extends TextFieldValidator {
  constructor({fieldName, locale}) {
    super({
      fieldName, 
      locale, 
      isRequired: false, 
      maxLength: 80
    });

    // Set interjections
    this.interjections = { 
      ...this.interjections, // Merge interjections from TextFieldValidator
      placeAlreadyPresent: capitalizeFirstLetter(BaseFieldValidator.getRandomInterjection())
    }
  }
  
  // If validation fails to process for any reason 
  // we wil reject the validation promise and block any chance of allowing
  // validation to complete.
  async validate(placeName, selectedPlaces) {
    const validationErrorMessages = await super.validate(placeName);

    // Add validation warning if the place already exists
    // in the collection of places
    if(placeName) {
      const placeNameLowerCase = placeName.toLowerCase()
      const matchingPlaces = 
        (selectedPlaces || []).filter(t => (t.name || '').toLowerCase() === placeNameLowerCase);
      if(matchingPlaces.length > 0) {
        validationErrorMessages.push(`${this.interjections.placeAlreadyPresent}! ${placeName} is already added.`);
      }
    }

    // So long as we successfully finished validating, we resolve
    // with any error messages included in the resolution
    return validationErrorMessages;
  }
}