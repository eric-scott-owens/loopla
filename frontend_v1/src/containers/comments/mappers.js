import forEach from 'lodash/forEach';
import configuration from '../../configuration';
import { mapObject, newKeyFor } from '../../utilities/ObjectUtilities';
import { fromClientPlaceObject } from '../places/mappers';
import { fromClientTagObject } from '../tags/mappers';
import { getSlateValueFor, getPlainTextForSlateValue } from '../../components/form-controls/RichTextField/SerializerUtilities';

// <summary>
// Converts a comment retrieved from the server into a full JS objects
// </summary>
export function fromServerCommentObject(comment) {
  const convertedComment = mapObject.fromServerDatabaseObject(comment);

  delete convertedComment.textRichJson;
  if(configuration.enableRichTextEditing) {
    convertedComment.text = getSlateValueFor(comment.textRichJson || comment.text);
  }

  convertedComment.ownerId = comment.owner;
  delete convertedComment.owner;

  convertedComment.postId = comment.post;
  delete convertedComment.post;

  convertedComment.places = comment.placeIds;
  delete convertedComment.placeIds;

  convertedComment.tags = comment.tagIds;
  delete convertedComment.tagIds;

  convertedComment.kudosReceived = comment.kudosReceivedIds;
  delete convertedComment.kudosReceivedIds;

  return convertedComment;
};

export function fromClientCommentObject(comment, state) {
  const convertedComment = mapObject.fromClientDatabaseObject(comment);

  if(configuration.enableRichTextEditing) {
    convertedComment.text = getPlainTextForSlateValue(comment.text);
    convertedComment.textRichJson = JSON.stringify(comment.text.toJSON());
  } else {
    convertedComment.textRichJson = null;
  }

  if(convertedComment.kudos) {
    // We never allow post editing to directly
    // update kudos
    delete convertedComment.kudos;
  }

  if(comment.places) {
    convertedComment.places = [];
    forEach(comment.places, placeKey => {
      let place = (placeKey.id || placeKey.name) ? placeKey : state.places[placeKey];
      
      if(place.id === newKeyFor(configuration.MODEL_TYPES.place)) {
        // Don't send back a junk ID
        delete place.id;
      } else {
        // Only send back the ID, everything 
        // else is already on the server
        place = { id: place.id, model: place.model };
      }
      
      convertedComment.places.push(fromClientPlaceObject(place));
    })
  }

  delete convertedComment.tagsUserGenerated;
  delete convertedComment.deletedGoogleTags;

  if(comment.tags) {
    convertedComment.tags = [];

    forEach(comment.tags, tagKey => {
      let tag = (tagKey.id || tagKey.name) ? {...tagKey} : {...state.tags[tagKey]};

      if(tag.id === newKeyFor(configuration.MODEL_TYPES.tag)) {
        delete tag.id;
      } else {
        // Only send back the ID, everything
        // else is already on the server
        tag = { id: tag.id, model: tag.model }
      }
      
      convertedComment.tags.push(fromClientTagObject(tag));
    });
  }

  const underscoredComment = mapObject.fromCamelCasedObject(convertedComment);
  return underscoredComment;
};

export function fromDeserializedClientCommentObject(comment) {
  const convertedComment = mapObject.fromDeserializedClientObject(comment);
  return convertedComment;
}