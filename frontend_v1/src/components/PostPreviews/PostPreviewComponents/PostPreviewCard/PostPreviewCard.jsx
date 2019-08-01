import React from "react";
import PropTypes from 'prop-types';
import Card from '../../../Card';

const PostPreviewCard = (props) => (
  <Card className={props.className}>
    {props.children}
  </Card>
)

PostPreviewCard.propTypes = {
  children: PropTypes.node
}

export default PostPreviewCard;