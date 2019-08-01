/**
 * Reflects the result of attempting to apply an AutoFormPlugin
 * to the child elements of an AutoForm while running getPreparedChildren()
 */
class PrepareChildrenPluginResult {
  /**
   * 
   * @param {*} wasPluginApplied - true if the plugin was applied to the current react component/element
   * @param {*} updatedAdditionalProps - This is the updated for of additionalProps if it has been modified
   * @param {*} clonedElement - this will be the cloned element produced by the plugin if one was rendered
   */
  constructor(
    wasPluginApplied, 
    updatedAdditionalProps,
    clonedElement
  ) {
    this.wasPluginApplied = wasPluginApplied;
    this.didPluginUpdateAdditionalProps = !!updatedAdditionalProps
    this.updatedAdditionalProps = updatedAdditionalProps
    this.didPluginRenderClone = !!clonedElement;
    this.clonedElement = clonedElement;
  }

  static pluginWasAppliedWithCloneElement(clonedElement) {
    return new PrepareChildrenPluginResult(true, undefined, clonedElement);
  }

  static pluginWasAppliedWithUpdatedAdditionalProps(updatedAdditionalProps) {
    return new PrepareChildrenPluginResult(true, updatedAdditionalProps);
  }

  static pluginWasNotApplied() {
    return new PrepareChildrenPluginResult(false);
  }
}

export default PrepareChildrenPluginResult