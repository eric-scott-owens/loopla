import moment from 'moment';
import { mapObject } from '../../../utilities/ObjectUtilities';


export function fromServerUnregisteredUserObject(unregisteredUser) {
  const convertedUnregisteredUser = mapObject.fromServerDatabaseObject(unregisteredUser);
  return convertedUnregisteredUser;
}

export function fromServerInvitationObject(invitation) {
  const convertedInvitation = mapObject.fromServerDatabaseObject(invitation);

  if(invitation.group) {
    convertedInvitation.groupId = invitation.group;
    delete convertedInvitation.group;
  }

  if(invitation.inviter) {
    convertedInvitation.inviterId = invitation.inviter;
    delete convertedInvitation.inviter;
  }

  convertedInvitation.invitee = null;
  if(invitation.invitee) {
    convertedInvitation.invitee = fromServerUnregisteredUserObject(invitation.invitee);
  }

  if(invitation.confirmed_invitee) {
    convertedInvitation.confirmedInviteeId = invitation.confirmed_invitee;
    delete convertedInvitation.confirmedInvitee;
  }

  convertedInvitation.sentTimestamp = null;
  if(invitation.sentTimestamp) {
    convertedInvitation.sentTimestamp = moment(invitation.sent_timestamp).toDate();
  }
  
  convertedInvitation.readEmailTimestamp = null;
  if(invitation.read_email_timestamp) {
    convertedInvitation.readEmailTimestamp = moment(invitation.read_email_timestamp).toDate();
  }

  convertedInvitation.firstVisitTimestamp = null;
  if(invitation.first_visit_timestamp) {
    convertedInvitation.firstVisitTimestamp = moment(invitation.first_visit_timestamp).toDate();
  }

  convertedInvitation.responseTimestamp = null;
  if(invitation.response_timestamp) {
    convertedInvitation.responseTimestamp = moment(invitation.response_timestamp).toDate();
  }

  return convertedInvitation;
}