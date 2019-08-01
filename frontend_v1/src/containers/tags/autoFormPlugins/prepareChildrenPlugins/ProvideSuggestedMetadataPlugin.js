import debounce from 'lodash/debounce';
import Plain from 'slate-plain-serializer';
import { Plugin, PluginResult } from '../../../../components/AutoForm/PrepareChildrenPlugins/BasePrepareChildrenPlugin';
import { globalGoogleTagService } from '../../GoogleTagService';

class ProvideSuggestedMetadataPlugin extends Plugin {

  constructor() {
    super();
    this.trackedFieldValues = {};
    this.onBlurHandlers = {};
    this.onChangeHandlers = {};

    this.debouncedGetSuggestedMetadata = debounce(this.getSuggestedMetadata, 2000);
  }

  // eslint-disable-next-line
  doesPluginApplyToReactElement = (autoFormInstance, component, componentName, editingObject, props, additionalProps) => {
    return (props && props.providesSuggestedMetadata === true);
  }

  getOnBlurHandler(autoFormInstance, props, additionalProps) {
    const { valuePath } = props;

    // Check if we've not yet created a handler for this component
    if(!this.onBlurHandlers[valuePath]) {
      this.onBlurHandlers[valuePath] = (event, ...others) => {
        let newValue = event.target.value;
        const editingObject = this.getEditingObject();
        
        // Support Rich text
        if (newValue.blocks && newValue.activeMarks) {
          // Successfully duck type checked for a SlateJS::Value object
          newValue = Plain.serialize(newValue);
        }
  
        // Trigger any pre-existing onBlur handlers
        if(additionalProps.onBlur) {
          additionalProps.onBlur(event, ...others);
        }
        else if(props.onBlur) {
          props.onBlur(event, ...others);
        }

        this.debouncedGetSuggestedMetadata(valuePath, newValue, autoFormInstance, editingObject);
      };
    }

    // Return the pre-existing onBlur handler
    return this.onBlurHandlers[valuePath];
  }

  getOnChangeHandler(autoFormInstance, props, additionalProps) {
    const { valuePath } = props;

    // Check if we've not yet created a handler for this component
    if(!this.onChangeHandlers[valuePath]) {
      this.onChangeHandlers[valuePath] = (fieldValue, ...others) => {
        let newValue = fieldValue;
        const editingObject = this.getEditingObject();
        
        // Support Rich text
        if (newValue.blocks && newValue.activeMarks) {
          // Successfully duck type checked for a SlateJS::Value object
          newValue = Plain.serialize(newValue);
        }

        // Trigger any pre-existing onChange handlers
        if(additionalProps.onChange) {
          additionalProps.onChange(fieldValue, ...others);
        }
        else if(props.onChange) {
          props.onChange(fieldValue, ...others);
        }

        this.debouncedGetSuggestedMetadata(valuePath, newValue, autoFormInstance, editingObject);
      };
    }
    
    // Return the pre-existing onChange handler
    return this.onChangeHandlers[valuePath];
  }

  // eslint-disable-next-line
  applyPluginToReactElement(autoFormInstance, component, componentName, editingObject, props, additionalProps) {
    const updatedAdditionalProps = { ...additionalProps };
    updatedAdditionalProps.onBlur = this.getOnBlurHandler(autoFormInstance, props, additionalProps);
    updatedAdditionalProps.onChange = this.getOnChangeHandler(autoFormInstance, props, additionalProps);
    return PluginResult.pluginWasAppliedWithUpdatedAdditionalProps(updatedAdditionalProps);
  }

  getSuggestedMetadata = async (fieldPath, value, autoFormInstance) => {
    // simple way to not ask as often for suggested tags
    if(value !== this.trackedFieldValues[fieldPath]){
      this.trackedFieldValues[fieldPath] = value;
      const lockId = 'getSuggestedMetadata';
      autoFormInstance.addDelayProcessingLock(lockId);
      try {
        const meta = await globalGoogleTagService.getSuggestedMetadata(this.trackedFieldValues);
        const tagIds = meta.tag_ids;
        const categoryIds = meta.category_ids;
        
        this.addSuggestedTagsToEditingObject(tagIds);
        this.addSuggestedCategoriesToEditingObject(categoryIds);

        autoFormInstance.removeDelayProcessingLock(lockId);
      }
      catch(e) {
        autoFormInstance.removeDelayProcessingLock(lockId);
      }
    }
  }

  addSuggestedTagsToEditingObject = (tagIds) => {
    const editingObject = this.autoFormInstance.getEditingObject();
    const updatedEditingObject = {...editingObject};
    
    const editingObjectTags = updatedEditingObject.tags ? [...updatedEditingObject.tags] : [];
    const selectedTagIds = editingObjectTags.map(t => (t.id) ? t.id : t);
    const deletedGoogleTags = updatedEditingObject.deletedGoogleTags ? updatedEditingObject.deletedGoogleTags : [];

    tagIds.forEach(tagId => {
      if(
        deletedGoogleTags.indexOf(tagId) === -1 && 
        selectedTagIds.filter(id => id === tagId).length === 0
      ){
        editingObjectTags.push(tagId);
      }
    });

    updatedEditingObject.tags = editingObjectTags;
    updatedEditingObject.deletedGoogleTags = deletedGoogleTags;

    this.autoFormInstance.setEditingObject(updatedEditingObject);
  }

  addSuggestedCategoriesToEditingObject = (categoryIds) => {
    const editingObject = this.autoFormInstance.getEditingObject();
    const updatedEditingObject = {...editingObject};
    const selectedCategoryIds = updatedEditingObject.categoryIds ? [...updatedEditingObject.categoryIds] : [];
    const deletedCategoryIds = updatedEditingObject.deletedCategoryIds ? updatedEditingObject.deletedCategoryIds : [];

    categoryIds.forEach(categoryId => {
      if(
        deletedCategoryIds.indexOf(categoryId) === -1 && 
        selectedCategoryIds.filter(c => c === categoryId).length === 0
      ){
        selectedCategoryIds.push(categoryId);
      }
    });

    updatedEditingObject.categoryIds = selectedCategoryIds;
    updatedEditingObject.deletedCategoryIds = deletedCategoryIds;
    
    this.autoFormInstance.setEditingObject(updatedEditingObject);
  }
}

export default ProvideSuggestedMetadataPlugin;