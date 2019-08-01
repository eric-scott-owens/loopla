import moment from 'moment';
import { mapObject } from '../../utilities/ObjectUtilities';
import configuration from '../../configuration';
  
  
// <summary>
// Converts a user retrieved from the server into a full JS objects
// </summary>
export function fromServerUserObject(user) {
  const convertedUser = mapObject.fromServerDatabaseObject(user);
  
  // Merge profile info into parent 
  Object.assign(convertedUser, convertedUser.person);
  Object.assign(convertedUser, convertedUser.privacyPreferences);
  Object.assign(convertedUser, convertedUser.notificationPreferences);
  delete convertedUser.person;
  delete convertedUser.privacyPreferences;
  delete convertedUser.notificationPreferences;

  convertedUser.groups = user.groupIds;

  convertedUser.newestUpdate = moment(user.newestUpdate).toDate();
  convertedUser.dateJoined = moment(user.dateJoined).toDate();

  return convertedUser;
};


export function fromClientUserObject(user, state) {
  const convertedUser = mapObject.fromClientDatabaseObject(user);

  const person = {};
  person.middleName = convertedUser.middleName;
  delete convertedUser.middleName;
  person.telephoneNumber = convertedUser.telephoneNumber;
  delete convertedUser.telephoneNumber;
  person.city = convertedUser.city;
  delete convertedUser.city;
  person.state = convertedUser.state;
  delete convertedUser.state;
  person.address_line_1 = convertedUser.addressLine1;
  delete convertedUser.addressLine1;
  person.address_line_2 = convertedUser.addressLine2;
  delete convertedUser.addressLine2;
  person.address_line_3 = convertedUser.addressLine3;
  delete convertedUser.addressLine3;
  person.zipcode = convertedUser.zipcode;
  delete convertedUser.zipcode;
  person.biography = convertedUser.biography;
  delete convertedUser.biography;

  if(convertedUser.photo) {
    convertedUser.photo = {};
      if(user.photo.originalSize > 0) {
        // Is file to upload, send the whole thing back.
        convertedUser.photo = user.photo.base64EncodedData
      } else {
        const photo = state.photos[user.photo];
        convertedUser.photo = { id: photo.id };
      }
  }

  person.photo = convertedUser.photo;
  delete convertedUser.photo;

  convertedUser.person = person;

  const privacyPreferences = {};
  privacyPreferences.isShareEmail = convertedUser.isShareEmail;
  delete convertedUser.isShareEmail;
  privacyPreferences.isSharePhone = convertedUser.isSharePhone;
  delete convertedUser.isSharePhone;
  privacyPreferences.isShareAddress = convertedUser.isShareAddress;
  delete convertedUser.isShareAddress;

  convertedUser.privacyPreferences = privacyPreferences;

  const notificationPreferences = {};
  notificationPreferences.notifyByEmail = convertedUser.notifyByEmail;
  delete convertedUser.notifyByEmail;
  notificationPreferences.notifyByText = convertedUser.notifyByText;
  delete convertedUser.notifyByText;

  convertedUser.notificationPreferences = notificationPreferences;

  const underscoredUser = mapObject.fromCamelCasedObject(convertedUser);
  return underscoredUser;
};


export function fromServerUserDisplayObject(user) {
  const convertedUser = mapObject.fromServerDatabaseObject({...user, model: configuration.MODEL_TYPES.user });
  return convertedUser;
}

export function fromDeserializedClientUserObject(user) {
  const convertedUser = mapObject.fromDeserializedClientObject(user);
  convertedUser.newestUpdate = moment(user.newestUpdate).toDate();
  convertedUser.dateJoined = moment(user.dateJoined).toDate();
  return convertedUser;
}