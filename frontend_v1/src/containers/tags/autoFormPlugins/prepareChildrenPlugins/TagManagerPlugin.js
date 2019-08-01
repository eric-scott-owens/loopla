import { Plugin, PluginResult } from '../../../../components/AutoForm/PrepareChildrenPlugins/BasePrepareChildrenPlugin';
import configuration from '../../../../configuration';

class TagManagerPlugin extends Plugin {
  
  constructor() {
    super();
    this.onNewTagNameChangeHandlers = {};
    this.onAddValidatedTagHandlers = {};
    this.onDeleteTagHandlers = {};
  }

  doesPluginApplyToReactElement = (autoFormInstance, component, componentName, editingObject, props, additionalProps) => {
    return (componentName === 'TagField');
  }

  applyPluginToReactElement(autoFormInstance, component, componentName, editingObject, props, additionalProps) {
    const updatedAdditionalProps = { ...additionalProps };
    updatedAdditionalProps.onNewTagNameChange = this.getOnNewTagNameChangeHandler(autoFormInstance, props);
    updatedAdditionalProps.onAddValidatedTag = this.getOnAddValidatedTagHandler(autoFormInstance, props);
    updatedAdditionalProps.onDeleteTag = this.getOnDeleteTagHandler(autoFormInstance, props);
    delete updatedAdditionalProps.onChange; // Delete AutoForm's default onChange handler

    if(!editingObject[configuration.internalFieldNames.NEW_TAG_NAME]) {
      // eslint-disable-next-line
      editingObject[configuration.internalFieldNames.NEW_TAG_NAME] = '';
    }

    return PluginResult.pluginWasAppliedWithUpdatedAdditionalProps(updatedAdditionalProps);
  }

  getOnNewTagNameChangeHandler(autoFormInstance, props) {
    const { valuePath } = props;

    if(!this.onNewTagNameChangeHandlers[valuePath]) {
      this.onNewTagNameChangeHandlers[valuePath] = (fieldValue) => autoFormInstance.onFieldValueUpdate(configuration.internalFieldNames.NEW_TAG_NAME, fieldValue);
    }

    return this.onNewTagNameChangeHandlers[valuePath];
  }

  getOnAddValidatedTagHandler(autoFormInstance, props) {
    const { valuePath } = props;

    if(!this.onAddValidatedTagHandlers[valuePath]) {
      this.onAddValidatedTagHandlers[valuePath] = (tag) => {
        const editingObject = this.getEditingObject();
        const updatedEditingObject = {...editingObject};
        
        const editingObjectTags = updatedEditingObject.tags ? [...updatedEditingObject.tags] : [];
        const selectedTagIds = editingObjectTags.map(t => t.id ? t.id : t);
        
        if(selectedTagIds.filter(t => t === tag.id).length === 0){
          editingObjectTags.push(tag);
        }
    
        updatedEditingObject.tags = editingObjectTags;
        updatedEditingObject[configuration.internalFieldNames.NEW_TAG_NAME] = '';
        autoFormInstance.setEditingObject(updatedEditingObject);
      };
    }

    return this.onAddValidatedTagHandlers[valuePath];
  }

  getOnDeleteTagHandler(autoFormInstance, props) {
    const { valuePath } = props;

    if(!this.onDeleteTagHandlers[valuePath]) {
      this.onDeleteTagHandlers[valuePath] = (tag) => {
        const editingObject = this.getEditingObject();
        const updatedEditingObject = {...editingObject};
        const editingObjectTags = updatedEditingObject.tags ? [...updatedEditingObject.tags] : [];
        const selectedTagIds = editingObjectTags.map(t => t.id ? t.id : t);
        const deletedGoogleTags = updatedEditingObject.deletedGoogleTags ? [...updatedEditingObject.deletedGoogleTags] : [];
        
        // Remove the tag from the tag collection
        const tagIndex = selectedTagIds.indexOf(tag.id || tag); // Find the index via selected tags so we are full tags only
        editingObjectTags.splice(tagIndex, 1); // use the determined index to update our mixed tags and tag keys collection
    
        // If a google tag, add it to the deleted collection
        // so that it can't be auto added
        if(tag.isUserGenerated === false) {
          deletedGoogleTags.push(tag.name);
        }
    
        updatedEditingObject.tags = editingObjectTags;
        updatedEditingObject.deletedGoogleTags = deletedGoogleTags;
        autoFormInstance.setEditingObject(updatedEditingObject);
      };
    }

    return this.onDeleteTagHandlers[valuePath];
  }

}

export default TagManagerPlugin;