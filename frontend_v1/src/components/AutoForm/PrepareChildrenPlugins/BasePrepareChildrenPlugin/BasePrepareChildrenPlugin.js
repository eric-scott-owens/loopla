import PrepareChildrenPluginResult from './BasePrepareChildrenPluginResult';

/**
 * Defines a generic plugin that can be registered to run during
 * AutoForm.getPreparedChildren() to augment AutoForms capabilities.
 */
class PrepareChildrenPlugin {

  /**
   * Abstract Function - 
   *  Implementation should return a boolean indicating whether or not this
   *  plugin applied to the current component or element
   * 
   * @param {React.Element} autoFormInstance - the react AutoForm that is the parent of the children being prepared
   * @param {React.Element} component - the react component or element being prepared for use in the AutoForm
   * @param {string} componentName - the name of the component or element
   * @param {*} editingObject - the data object being handled by AutoForm
   * @param {*} props - the component's original react properties
   * @param {*} additionalProps - the additional properties to be added to the component by AutoForm
   */
  // eslint-disable-next-line
  doesPluginApplyToReactElement(autoFormInstance, component, componentName, editingObject, props, additionalProps) {
    throw new Error('Method not implement: doesPluginApplyToReactElement');
  }

  /**
   * Abstract Function - 
   *  If this plugin should be applied (as defined by doesPluginApplyToReactElement()), 
   *  this function will be called to apply the plugin to the current react component
   * 
   * @param {React.Element} autoFormInstance - the react AutoForm that is the parent of the children being prepared
   * @param {React.Element} component - the react component or element being prepared for use in the AutoForm
   * @param {string} componentName - the name of the component or element
   * @param {*} editingObject - the data object being handled by AutoForm
   * @param {*} props - the component's original react properties
   * @param {*} additionalProps - 
   *  the additional properties to be added to the component by AutoForm
   *  This object can be extended by the plugin to add additional properties in-leu of
   *  rendering an entire clone
   * @returns {PrepareChildrenPluginResult} - The result of the plugin having run.
   */
  // eslint-disable-next-line
  applyPluginToReactElement(autoFormInstance, component, componentName, editingObject, props, additionalProps) {
    throw new Error('Method not implement: applyPluginToReactElement');
  }

  getEditingObject() {
    return this.autoFormInstance.getEditingObject();
  }

  /**
   * Tries to apply the current plugin to the current component being prepared
   * by AutoForm.getPreparedChildren()
   * 
   * @param {React.Element} autoFormInstance - the react AutoForm that is the parent of the children being prepared
   * @param {React.Element} component - the react component or element being prepared for use in the AutoForm
   * @param {string} componentName - the name of the component or element
   * @param {*} editingObject - the data object being handled by AutoForm
   * @param {*} props - the component's original react properties
   * @param {*} additionalProps - the additional properties to be added to the component by AutoForm
   */
  tryApplyPluginToReactElement(autoFormInstance, component, componentName, editingObject, props, additionalProps) {
    if(this.doesPluginApplyToReactElement(autoFormInstance, component, componentName, editingObject, props, additionalProps)) {
      const result = this.applyPluginToReactElement(autoFormInstance, component, componentName, editingObject, props, additionalProps);
      if(!(result instanceof PrepareChildrenPluginResult)) {
        throw new Error('FATAL ERROR: applyPluginToReactElement() must return an instance of PrepareChildrenPluginResult');
      }

      this.autoFormInstance = autoFormInstance;

      return result;
    }

    return PrepareChildrenPluginResult.pluginWasNotApplied();
  }

}

export default PrepareChildrenPlugin;