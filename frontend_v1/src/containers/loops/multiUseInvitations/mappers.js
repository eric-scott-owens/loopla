import { mapObject, keyFor } from '../../../utilities/ObjectUtilities';


export function fromServerUnregisteredUserObject(unregisteredUser) {
  const convertedUnregisteredUser = mapObject.fromServerDatabaseObject(unregisteredUser);
  return convertedUnregisteredUser;
}

export function fromServerMultiUseInvitationObject(invitation) {
  const convertedMultiUseInvitation = mapObject.fromServerDatabaseObject(invitation);

  delete convertedMultiUseInvitation.group;
  if(invitation.group) {
    convertedMultiUseInvitation.groupId = keyFor.Group({ id: invitation.group });
  }

  return convertedMultiUseInvitation;
}