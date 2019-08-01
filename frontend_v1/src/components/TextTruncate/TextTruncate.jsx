import React, { memo } from 'react';
import PropTypes from 'prop-types';

const TextTruncate = ({text, textTruncateChild, maxLength}) => {

  const finalMaxLength = maxLength || 200;
  const finalText = (text && text.length > finalMaxLength) ? `${text.substring(0, finalMaxLength)}...`: text;

  return (
    <React.Fragment>
      {finalText}
      {/* {textTruncateChild} */}
    </React.Fragment>
  );

}

TextTruncate.propTypes = {
  text: PropTypes.string,
  maxLength: PropTypes.number
}

export default memo(TextTruncate);