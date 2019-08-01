import moment from 'moment';
import forEach from 'lodash/forEach';
import configuration from '../../configuration';
import { fromClientPlaceObject } from '../places/mappers';
import { fromClientTagObject } from '../tags/mappers';
import { mapObject, newKeyFor } from '../../utilities/ObjectUtilities';
import { getSlateValueFor, getPlainTextForSlateValue } from '../../components/form-controls/RichTextField/SerializerUtilities';

// <summary>
// Converts posts retrieved from the server into full JS objects
// </summary>
export function fromServerPostObject(post) {
  const convertedPost = mapObject.fromServerDatabaseObject(post);
  
  delete convertedPost.textRichJson;
  if(configuration.enableRichTextEditing) {
    convertedPost.text = getSlateValueFor(post.textRichJson || post.text);
  }

  convertedPost.groupId = post.group;
  delete convertedPost.group;

  convertedPost.ownerId = post.owner;
  delete convertedPost.owner;

  convertedPost.comments = post.commentIds.sort((a, b) => (a - b));
  delete convertedPost.commentIds;

  convertedPost.places = post.placeIds;
  delete convertedPost.placeIds;

  convertedPost.tags = post.tagIds;
  delete convertedPost.tagIds;

  convertedPost.kudosReceived = post.kudosReceivedIds;
  delete convertedPost.kudosReceivedIds;

  convertedPost.newestUpdate = moment(post.newestUpdate).toDate();

  return convertedPost;
}


/**
 * Converts a post reference from the server into a full JS object
 * @param {*} postReference 
 */
export function fromServerPostReferenceObject(postReference) {
  const convertedPostReference = {
    id: postReference.id,
    ownerId: postReference.owner || postReference.ownerId,
    rank: postReference.rank,
    newestUpdate: moment(postReference.newestUpdate).toDate()
  };

  return convertedPostReference;
}


/**
 * Converts the given post into a post reference 
 * @param {*} post 
 */
export function fromClientPostObjectToClientPostReferenceObject(post) {
  const postReference = {
    id: post.id,
    ownerId: post.ownerId,
    rank: post.rank,
    newestUpdate: post.newestUpdate
  };

  return postReference;
}


export function fromClientPostObject(post, state) {
  const convertedPost = mapObject.fromClientDatabaseObject(post);
  
  if(configuration.enableRichTextEditing) {
    convertedPost.text = getPlainTextForSlateValue(post.text);
    convertedPost.textRichJson = JSON.stringify(post.text.toJSON());
  } else {
    convertedPost.textRichJson = null;
  }

  if(convertedPost.comments) {
    // We never allow post editing to directly
    // update comments
    delete convertedPost.comments;
  }

  if(convertedPost.kudos) {
    // We never allow post editing to directly
    // update kudos
    delete convertedPost.kudos;
  }

  if(convertedPost.places) {
    convertedPost.places = [];
    forEach(post.places, placeKey => {
      let place = (placeKey.id || placeKey.name) ? placeKey : state.places[placeKey];
      
      if(place.id === newKeyFor(configuration.MODEL_TYPES.place)) {
        // Don't send back a junk ID
        delete place.id;
      } else {
        // Only send back the ID, everything 
        // else is already on the server
        place = { id: place.id, model: place.model };
      }
      
      convertedPost.places.push(fromClientPlaceObject(place));
    })
  }

  delete convertedPost.tagsUserGenerated;
  delete convertedPost.deletedGoogleTags;

  if(convertedPost.tags) {
    convertedPost.tags = [];
    forEach(post.tags, tagKey => {
      let tag = (tagKey.id || tagKey.name) ? {...tagKey} : {...state.tags[tagKey]};

      if(tag.id === newKeyFor(configuration.MODEL_TYPES.tag)) {
        delete tag.id;
      } else {
        // Only send back the ID, everything
        // else is already on the server
        tag = { id: tag.id, model: tag.model }
      }
      
      convertedPost.tags.push(fromClientTagObject(tag));
    });
  }
  
  const underscoredPost = mapObject.fromCamelCasedObject(convertedPost);
  return underscoredPost;
}

export function fromDeserializedClientPostObject(post) {
  const convertedPost = mapObject.fromDeserializedClientObject(post);
  convertedPost.newestUpdate = moment(post.newestUpdate).toDate();
  return convertedPost;
}