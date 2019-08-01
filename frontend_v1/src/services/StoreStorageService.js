import forEach from 'lodash/forEach';
import configuration from '../configuration';
import { IDENTIFIER_PREFIXES, getTableNameForModelType } from '../utilities/ObjectUtilities';

class ModelStorageService {
  /**
   * Creates a new storage service for the given model using the 
   * provided storage strategy
   * @param {*} modelType 
   * @param {*} asyncStorageStrategy 
   */
  constructor(modelType, asyncStorageStrategy) {
    if(!IDENTIFIER_PREFIXES[modelType]) throw new Error('Unsupported model type');
    if(!asyncStorageStrategy) throw new Error('asyncStorageStrategy is required');

    this.modelIdPrefix = IDENTIFIER_PREFIXES[modelType];
    this.asyncStorageStrategy = asyncStorageStrategy;
  }

  isKeyValidForModelType(keyForObject) {
    return (keyForObject.indexOf(this.modelIdPrefix) === 0);
  }

  validateKeyIsForRightModelType(keyForObject) {
    if(!this.isKeyValidForModelType(keyForObject)) throw new Error('Provided key is for the wrong model type')
  }

  async getAsync(keyForObject) {
    this.validateKeyIsForRightModelType(keyForObject);
    const json = await this.asyncStorageStrategy.getItemAsync(keyForObject);
    const model = JSON.parse(json);
    return model;
  }
  
  async setAsync(object) {
    this.validateKeyIsForRightModelType(object.key);
    const json = JSON.stringify(object);
    return this.asyncStorageStrategy.setItemAsync(object.key, json);
  }

  async removeAsync(keyForObject) {
    this.validateKeyIsForRightModelType(keyForObject);
    return this.asyncStorageStrategy.removeItemAsync(keyForObject);
  }

  async keysAsync() {
    const isKeyValidForModelType = this.isKeyValidForModelType.bind(this);
    const keys = await this.asyncStorageStrategy.getAllKeysAsync();
    
    const matchingKeys = [];
    forEach(keys, key => { 
      if(isKeyValidForModelType(key)) {
        matchingKeys.push(key);
      }
    });

    return matchingKeys;
  }

  async getAllAsync() {
    const that = this;
    const keys = await this.keysAsync();
    
    const getModelPromises = [];
    forEach(keys, key => {
      const modelPromise = that.getAsync(key);
      getModelPromises.push(modelPromise);
    });

    const models = await Promise.all(getModelPromises);
    return models;
  }

  async removeAllAsync() {
    const that = this;
    const keys = await this.keysAsync();

    const getModelPromises = [];
    forEach(keys, key => {
      const modelPromise = that.removeAsync(key);
      getModelPromises.push(modelPromise);
    });

    const models = await Promise.all(getModelPromises);
    return models;
  }
}

export default class StoreStorageService {
  constructor(asyncLocalStorageStrategy, asyncSessionStorageStrategy) {
    this.temp = new ModelStorageService('temp', asyncSessionStorageStrategy);

    // Create a storage location for each type of model
    const modelTypes = Object.keys(configuration.MODEL_TYPES);
    forEach(modelTypes, modelType => {
      const tableName = getTableNameForModelType(configuration.MODEL_TYPES[modelType]);
      if(!this[modelType]) {
        this[tableName] = new ModelStorageService(modelType, asyncLocalStorageStrategy);
      }
    });
  }
};
