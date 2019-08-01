import { mapObject } from '../../../utilities/ObjectUtilities';

function fromFormDataToServerModel(formData) {
  const mappedData = mapObject.fromCamelCasedObject(formData);
  
  delete mappedData.model;
  delete mappedData.id;
  delete mappedData.retype_password;

  return mappedData;
}

export default fromFormDataToServerModel;