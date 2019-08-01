import React from 'react';
import PropTypes from 'prop-types';
import Comment from '../Comment';

const CommentList = ({commentIds, disabled, editingCommentId, editComment, cancelEditComment}) => (
  <div className="o-comment-list">
    {commentIds.map(id => (
      <Comment 
        id={id} 
        key={id} 
        disabled={disabled}
        isEditing={editingCommentId === id}
        editComment={editComment} 
        cancelEditComment={cancelEditComment} />
    ))}
  </div>
);

CommentList.propTypes = {
  commentIds: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number])).isRequired,
  disabled: PropTypes.bool,
  editingCommentId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  editComment: PropTypes.func,
  cancelEditComment: PropTypes.func,
}

export default CommentList;