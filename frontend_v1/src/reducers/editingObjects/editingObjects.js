import set from 'lodash/set';
import configuration from '../../configuration';
import * as actions from '../../actions/editingObjects';

export default {
  [actions.ACTION_TYPES.add]: (state, action) => {
    const thing = action.payload;
    const updatedState = {...state};
    updatedState[thing.id] = thing;
    return updatedState;
  },
  [actions.ACTION_TYPES.updateField]: (state, action) => {
    const { editingObjectId, fieldName, fieldValue } = action;
    const updatedState = {...state};
    const updatedEditingObject = {...updatedState[editingObjectId]};
    
    set(updatedEditingObject, fieldName, fieldValue);
    updatedState[editingObjectId] = updatedEditingObject;
    return updatedState;
  }, 
  [actions.ACTION_TYPES.remove]: (state, action) => {
    const editingObjectId = action.payload;
    const updatedState = {...state};
    delete updatedState[editingObjectId];
    return updatedState;
  },
  [actions.ACTION_TYPES.deleteProperty]: (state, action) => {
    const { editingObjectId } = action;
    const updatedState = { ...state }; 
    const updatedEditingObject = { ...state[editingObjectId] };
    
    // Based on https://stackoverflow.com/a/6491621 
    let { propertyPath } = action;
    propertyPath = propertyPath.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
    propertyPath = propertyPath.replace(/^\./, '');           // strip a leading dot
    const pathSegments = propertyPath.split('.');
    let editingObjectPart = updatedEditingObject;
    while(pathSegments.length > 1) {
      const segment = pathSegments.shift();
      editingObjectPart = editingObjectPart[segment];
    }

    const finalSegment = pathSegments.shift();
    if(Array.isArray(editingObjectPart)) {
      editingObjectPart.splice(finalSegment, 1);
    } else {
      delete editingObjectPart[finalSegment];
    }

    updatedState[editingObjectId] = updatedEditingObject;
    return updatedState;
  },
  [actions.ACTION_TYPES.removeItemFromEditingObjectArray]: (state, action) => { 
    const { editingObjectId, item } = action;
    const updatedState = { ...state };
    const updatedEditingObject = { ...(state[editingObjectId]) };
    
    // Based on https://stackoverflow.com/a/6491621 
    let { arrayPropertyPath } = action;
    arrayPropertyPath = arrayPropertyPath.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
    arrayPropertyPath = arrayPropertyPath.replace(/^\./, '');           // strip a leading dot
    const pathSegments = arrayPropertyPath.split('.');
    let editingObjectPart = updatedEditingObject;
    while(pathSegments.length > 1) {
      const segment = pathSegments.shift();
      editingObjectPart = editingObjectPart[segment];
    }

    const lastSegment = pathSegments.shift();
    const arrayParent = editingObjectPart;
    if(!Array.isArray(arrayParent[lastSegment])) {
      throw new Error('The property path does not identify an Array property');
    } else {
      const arrayProperty = arrayParent[lastSegment].slice(0);
      const itemIndex = arrayProperty.findIndex(item);
      if(itemIndex > -1) {
        arrayProperty.splice(itemIndex, 1);
        arrayParent[lastSegment] = arrayProperty;
      } else {
        // THIS IS A BIG PERFORMANCE BOOST
        // If we don't remove anything, just return the original state.
        return state;
      }
    }

    // Merge up the new state and return it
    updatedState[editingObjectId] = updatedEditingObject;
    return updatedState;
  },
  [actions.ACTION_TYPES.removeItemFromEditingObjectArrayByIndex]: (state, action) => { 
    const { editingObjectId, itemIndex } = action;
    const updatedState = { ...state };
    const updatedEditingObject = { ...(state[editingObjectId]) };
    
    // Based on https://stackoverflow.com/a/6491621 
    let { arrayPropertyPath } = action;
    arrayPropertyPath = arrayPropertyPath.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
    arrayPropertyPath = arrayPropertyPath.replace(/^\./, '');           // strip a leading dot
    const pathSegments = arrayPropertyPath.split('.');
    let editingObjectPart = updatedEditingObject;
    while(pathSegments.length > 1) {
      const segment = pathSegments.shift();
      editingObjectPart = editingObjectPart[segment];
    }

    const lastSegment = pathSegments.shift();
    const arrayParent = editingObjectPart;
    if(!Array.isArray(arrayParent[lastSegment])) {
      throw new Error('The property path does not identify an Array property');
    } else {
      const arrayProperty = arrayParent[lastSegment].slice(0);
      arrayProperty.splice(itemIndex, 1);
      arrayParent[lastSegment] = arrayProperty;
    }

    updatedState[editingObjectId] = updatedEditingObject;
    return updatedState;
  },
  [actions.ACTION_TYPES.pushValueToEditingObjectArray]: (state, action) => {
    const { editingObjectId, value } = action;
    const updatedState = { ...state };
    const updatedEditingObject = { ...(state[editingObjectId]) };
    
    // Based on https://stackoverflow.com/a/6491621 
    let { arrayPropertyPath } = action;
    arrayPropertyPath = arrayPropertyPath.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
    arrayPropertyPath = arrayPropertyPath.replace(/^\./, '');           // strip a leading dot
    const pathSegments = arrayPropertyPath.split('.');
    let editingObjectPart = updatedEditingObject;
    while(pathSegments.length > 1) {
      const segment = pathSegments.shift();
      editingObjectPart = editingObjectPart[segment];
    }

    const lastSegment = pathSegments.shift();
    const arrayParent = editingObjectPart;
    if(!Array.isArray(arrayParent[lastSegment])) {
      throw new Error('The property path does not identify an Array property');
    } else {
      const arrayProperty = arrayParent[lastSegment].slice(0);
      arrayProperty.push(value);
      arrayParent[lastSegment] = arrayProperty;
    }

    updatedState[editingObjectId] = updatedEditingObject;
    return updatedState;
  },
  [actions.ACTION_TYPES.startEditing]: (state, action) => {
    const { editingObjectId } = action;
    const updatedState = { ...state };
    const updatedEditingObject = { ...state[editingObjectId] };

    updatedEditingObject[configuration.internalFieldNames.IS_EDITING] = true;
    updatedState[editingObjectId] = updatedEditingObject;
    return updatedState;
  },
  [actions.ACTION_TYPES.stopEditing]: (state, action) => {
    const { editingObjectId } = action;
    const updatedState = { ...state };
    const updatedEditingObject = { ...state[editingObjectId] };

    updatedEditingObject[configuration.internalFieldNames.IS_EDITING] = false;
    updatedState[editingObjectId] = updatedEditingObject;
    return updatedState;
  }
};