import { Plugin, PluginResult } from '../BasePrepareChildrenPlugin';

class AutoTrimTextPlugin extends Plugin {

  constructor() {
    super();
    this.onChangeHandlers = {};
  }

  // eslint-disable-next-line
  doesPluginApplyToReactElement = (autoFormInstance, component, componentName, editingObject, props, additionalProps) => {
    return (props && props.autoTrimText === true);
  }

  // eslint-disable-next-line
  applyPluginToReactElement(autoFormInstance, component, componentName, editingObject, props, additionalProps) {
    const updatedAdditionalProps = { ...additionalProps };
    updatedAdditionalProps.onChange = this.getOnChangeHandler(autoFormInstance, props, additionalProps);
    return PluginResult.pluginWasAppliedWithUpdatedAdditionalProps(updatedAdditionalProps);
  }

  getOnChangeHandler(autoFromInstance, props, additionalProps) {
    const { valuePath } = props;

    if(!this.onChangeHandlers[valuePath]) {
      this.onChangeHandlers[valuePath] = (fieldValue, ...others) => {
        // Trim the passed value before allowing AutoForm's onChange handler to get the value
        const newValue = (fieldValue || '').trim(); // Trim happiness!
        
        // And now wire in AutoForms onChange handler
        if(additionalProps.onChange) {
          additionalProps.onChange(newValue, ...others);
        }
      };
    }

    // Return the pre-existing onChange handler
    return this.onChangeHandlers[valuePath];
  }
}

export default AutoTrimTextPlugin;