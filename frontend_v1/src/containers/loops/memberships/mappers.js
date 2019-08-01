import moment from 'moment';
import { mapObject } from '../../../utilities/ObjectUtilities';


export function fromServerMembershipObject(membership) {
  const convertedMembership = mapObject.fromServerDatabaseObject(membership);
  
  convertedMembership.groupId = membership.group;
  delete convertedMembership.group;

  convertedMembership.userId = membership.user;
  delete convertedMembership.user;

  convertedMembership.dateJoined = moment(membership.dateJoined).toDate();

  if(membership.dateBecameInactive) {
    convertedMembership.dateBecameInactive = moment(membership.dateBecameInactive).toDate();
  }

  if(membership.dateBecameCoordinator) {
    convertedMembership.dateBecameCoordinator = moment(membership.dateBecameCoordinator).toDate();
  }

  return convertedMembership;
}


export function fromClientMembershipObject(membership) {
  throw new Error('Not yet implemented');
}
