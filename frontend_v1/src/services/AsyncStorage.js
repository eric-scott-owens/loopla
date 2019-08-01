export class AsyncStorage {

  constructor(strategyAdapter) {
    this.clearAsync = strategyAdapter.clearAsync.bind(strategyAdapter);
    this.getItemAsync = strategyAdapter.getItemAsync.bind(strategyAdapter);
    this.getAllKeysAsync = strategyAdapter.getAllKeysAsync.bind(strategyAdapter);
    this.keyAsync = strategyAdapter.keyAsync.bind(strategyAdapter);
    this.removeItemAsync = strategyAdapter.removeItemAsync.bind(strategyAdapter);
    this.setItemAsync = strategyAdapter.setItemAsync.bind(strategyAdapter);
  }
}

export class StorageStrategyAdapter {
  /**
   * Creates an async storage implementation for a storage
   * strategy that matches the Web Storage interface
   * @param {WebStorage} webStorageStrategy 
   */
  constructor(webStorageStrategy) {
    this.storageStrategy = webStorageStrategy;
  }

  /**
   * Clears the contents in storage
   */
  async clearAsync() {
    this.storageStrategy.clear();
  }

  /**
   * Gets and item from storage matching the provided key
   * @param {String} keyName 
   */
  async getItemAsync(keyName) {
    return this.storageStrategy.getItem(keyName);
  }

  /**
   * Gets all items from storage
   */
  async getAllKeysAsync() {
    const strategy = this.storageStrategy;
    const keys = Object.keys(strategy);
    return keys;
  }

  /**
   * Gets the key for the item at the specified index
   * @param {Integer} index 
   */
  async keyAsync(index) {
    return this.storageStrategy.key(index);
  }
  
  /**
   * Removes the item identified by the provided key
   * @param {String} keyName 
   */
  async removeItemAsync(keyName) {
    this.storageStrategy.removeItem(keyName);
  }
  
  /**
   * Saves an item to storage via the provided key
   * @param {String} keyName
   * @param {String} keyValue the value to save in the store
   */
  async setItemAsync(keyName, keyValue) {
    this.storageStrategy.setItem(keyName, keyValue);
  }
  
}