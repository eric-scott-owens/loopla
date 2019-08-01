import { Plugin, PluginResult } from '../../../../components/AutoForm/PrepareChildrenPlugins/BasePrepareChildrenPlugin';
import configuration from '../../../../configuration';
import { getStore } from '../../../reduxStoreProvider';

class PlaceManagerPlugin extends Plugin {
  
  constructor() {
    super();
    this.onNewPlaceNameChangeHandlers = {};
    this.onAddValidatedPlaceHandlers = {};
    this.onDeletePlaceHandlers = {};
  }

  doesPluginApplyToReactElement = (autoFormInstance, component, componentName, editingObject, props, additionalProps) => {
    return (componentName === 'PlaceField');
  }

  applyPluginToReactElement(autoFormInstance, component, componentName, editingObject, props, additionalProps) {
    const updatedAdditionalProps = { ...additionalProps };
    updatedAdditionalProps.onNewPlaceNameChange = this.getOnNewPlaceNameChangeHandler(autoFormInstance, props);
    updatedAdditionalProps.onAddValidatedPlace = this.getOnAddValidatedPlaceHandler(autoFormInstance, props);
    updatedAdditionalProps.onDeletePlace = this.getOnDeletePlaceHandler(autoFormInstance, props);
    delete updatedAdditionalProps.onChange; // Delete AutoForm's default onChange handler

    if(!editingObject[configuration.internalFieldNames.NEW_PLACE_NAME]) {
      // eslint-disable-next-line
      editingObject[configuration.internalFieldNames.NEW_PLACE_NAME] = '';
    }

    return PluginResult.pluginWasAppliedWithUpdatedAdditionalProps(updatedAdditionalProps);
  }

  getOnNewPlaceNameChangeHandler(autoFormInstance, props) {
    const { valuePath } = props;

    if(!this.onNewPlaceNameChangeHandlers[valuePath]) {
      this.onNewPlaceNameChangeHandlers[valuePath] = (fieldValue) => autoFormInstance.onFieldValueUpdate(configuration.internalFieldNames.NEW_PLACE_NAME, fieldValue);
    }

    return this.onNewPlaceNameChangeHandlers[valuePath];
  }

  getOnAddValidatedPlaceHandler(autoFormInstance, props) {
    const { valuePath } = props;

    if(!this.onAddValidatedPlaceHandlers[valuePath]) {
      this.onAddValidatedPlaceHandlers[valuePath] = (place) => {
        const state = getStore().getState();
        const editingObject = this.getEditingObject();
        const updatedEditingObject = {...editingObject};
        const editingObjectPlaces = updatedEditingObject.places ? [...updatedEditingObject.places] : [];
        const selectedPlaces = editingObjectPlaces.map(p => (p.id || p.name) ? p : state.places[p]);

        if(selectedPlaces.filter(p => p.name === place.name && p.googlePlaceId === place.googlePlaceId).length === 0) {
          editingObjectPlaces.push(place);
        }

        updatedEditingObject.places = editingObjectPlaces;
        updatedEditingObject[configuration.internalFieldNames.NEW_PLACE_NAME] = '';
        autoFormInstance.setEditingObject(updatedEditingObject);
      };
    }

    return this.onAddValidatedPlaceHandlers[valuePath];
  }

  getOnDeletePlaceHandler(autoFormInstance, props) {
    const { valuePath } = props;

    if(!this.onDeletePlaceHandlers[valuePath]) {
      this.onDeletePlaceHandlers[valuePath] = (place) => {
        const state = getState();
        const editingObject = this.getEditingObject();
        const updatedEditingObject = {...editingObject};
        const editingObjectPlaces = updatedEditingObject.places ? [...updatedEditingObject.places] : [];
        const selectedPlaces = editingObjectPlaces.map(p => (p.id || p.name) ? p : state.places[p]);
        
        // Remove the place from the place collection
        const placeIndex = selectedPlaces.indexOf(place); // Find the index via selected places so we are full places only
        editingObjectPlaces.splice(placeIndex, 1); // use the determined index to update our mixed places and place keys collection
    
        updatedEditingObject.places = editingObjectPlaces;
        autoFormInstance.setEditingObject(updatedEditingObject);
      };
    }

    return this.onDeletePlaceHandlers[valuePath];
  }

}

export default PlaceManagerPlugin;