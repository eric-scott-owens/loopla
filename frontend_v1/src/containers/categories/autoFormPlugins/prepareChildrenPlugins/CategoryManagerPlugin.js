import { Plugin, PluginResult } from '../../../../components/AutoForm/PrepareChildrenPlugins/BasePrepareChildrenPlugin';
import configuration from '../../../../configuration';

class CategoryManagerPlugin extends Plugin {
  
  constructor() {
    super();
    this.onNewCategoryNameChangeHandlers = {};
    this.onAddValidatedCategoryHandlers = {};
    this.onDeleteCategoryHandlers = {};
  }

  doesPluginApplyToReactElement = (autoFormInstance, component, componentName, editingObject, props, additionalProps) => {
    return (componentName === 'CategoryField');
  }

  applyPluginToReactElement(autoFormInstance, component, componentName, editingObject, props, additionalProps) {
    const updatedAdditionalProps = { ...additionalProps };
    updatedAdditionalProps.onNewCategoryNameChange = this.getOnNewCategoryNameChangeHandler(autoFormInstance, props);
    updatedAdditionalProps.onAddValidatedCategory = this.getOnAddValidatedCategoryHandler(autoFormInstance, props);
    updatedAdditionalProps.onDeleteCategory = this.getOnDeleteCategoryHandler(autoFormInstance, props);
    delete updatedAdditionalProps.onChange; // Delete AutoForm's default onChange handler

    if(!editingObject[configuration.internalFieldNames.NEW_CATEGORY_NAME]) {
      // eslint-disable-next-line
      editingObject[configuration.internalFieldNames.NEW_CATEGORY_NAME] = '';
    }

    return PluginResult.pluginWasAppliedWithUpdatedAdditionalProps(updatedAdditionalProps);
  }

  getOnNewCategoryNameChangeHandler(autoFormInstance, props) {
    const { valuePath } = props;

    if(!this.onNewCategoryNameChangeHandlers[valuePath]) {
      this.onNewCategoryNameChangeHandlers[valuePath] = (fieldValue) => autoFormInstance.onFieldValueUpdate(configuration.internalFieldNames.NEW_CATEGORY_NAME, fieldValue);
    }

    return this.onNewCategoryNameChangeHandlers[valuePath];
  }

  getOnAddValidatedCategoryHandler(autoFormInstance, props) {
    const { valuePath } = props;

    if(!this.onAddValidatedCategoryHandlers[valuePath]) {
      this.onAddValidatedCategoryHandlers[valuePath] = (category) => {
        const editingObject = this.getEditingObject();
        const updatedEditingObject = {...editingObject};
        const categoryIds = updatedEditingObject.categoryIds ? [...updatedEditingObject.categoryIds] : [];
        const selectedCategoryIds = [...categoryIds];
        
        if(selectedCategoryIds.filter(id => id === category.id).length === 0){
          categoryIds.push(category.id);
        }
    
        updatedEditingObject.categoryIds = categoryIds;
        updatedEditingObject[configuration.internalFieldNames.NEW_CATEGORY_NAME] = '';
        autoFormInstance.setEditingObject(updatedEditingObject);
      };
    }

    return this.onAddValidatedCategoryHandlers[valuePath];
  }

  getOnDeleteCategoryHandler(autoFormInstance, props) {
    const { valuePath } = props;

    if(!this.onDeleteCategoryHandlers[valuePath]) {
      this.onDeleteCategoryHandlers[valuePath] = (category) => {
        const editingObject = this.getEditingObject();
        const updatedEditingObject = {...editingObject};
        const editingObjectCategoryIds = updatedEditingObject.categoryIds ? [...updatedEditingObject.categoryIds] : [];
        const deletedCategoryIds = updatedEditingObject.deletedCategoryIds ? [...updatedEditingObject.deletedCategoryIds] : [];
        
        // Remove the category from the category collection
        const categoryIndex = editingObjectCategoryIds.indexOf(category.id);
        editingObjectCategoryIds.splice(categoryIndex, 1);
        deletedCategoryIds.push(category.id);

        updatedEditingObject.categoryIds = editingObjectCategoryIds;
        updatedEditingObject.deletedCategoryIds = deletedCategoryIds;

        autoFormInstance.setEditingObject(updatedEditingObject);
      };
    }

    return this.onDeleteCategoryHandlers[valuePath];
  }

}

export default CategoryManagerPlugin;