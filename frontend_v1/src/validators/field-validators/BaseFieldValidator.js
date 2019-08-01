import random from 'random';
import configuration from '../../configuration';

export default class BaseFieldValidator {
  constructor(options) {
    if(!options.fieldName) throw new Error('options.fieldName is required');
    if(!options.locale) throw new Error('options.locale is required');

    this.fieldName = options.fieldName;
    this.locale = options.locale || 'en-US';
  }

  // If validation fails to process for any reason 
  // we wil reject the validation promise and block any chance of allowing
  // validation to complete.
  async validate() {
    throw new Error(`Cannot validated ${this.fieldName}... BaseFieldValidator.validate must be implemented by inheriting class.`);
  }

  static getRandomInterjection() {
    const index = random.int(0, configuration.cuteInterjections.length - 1);
    return configuration.cuteInterjections[index];
  }
}
