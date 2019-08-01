import isEqual from 'lodash/isEqual';
import configuration from '../../configuration';
import { getPlainTextForSlateValue } from '../../components/form-controls/RichTextField/SerializerUtilities';
import { newKeyFor } from '../../utilities/ObjectUtilities';

export function isCommentDirty(startingComment, updatedComment) {
  
  if (updatedComment && startingComment) {
    // This is an existing comment that is being editing. Deep check differences
    return isEqual(startingComment, updatedComment);
  }

  if(updatedComment && !startingComment) {
    const text = configuration.enableRichTextEditing ? 
      getPlainTextForSlateValue(updatedComment.text)
      : updatedComment.text;

    // this is a new comment, only check if it has content
    if(updatedComment.summary && updatedComment.summary.length > 0) return true;
    if(updatedComment.text && text.length > 0) return true;
    if(updatedComment.tags && updatedComment.tags.length > 0) return true;
    if(updatedComment.places && updatedComment.places.length > 0) return true;
    if(updatedComment.photos && updatedComment.photos.length > 0) return true;
  }

  return false;
}

const newCommentKeyPrefix = newKeyFor(configuration.MODEL_TYPES.comment);
export function isNewCommentId(commentId) {
  return `${commentId}`.indexOf(newCommentKeyPrefix) === 0;
}
