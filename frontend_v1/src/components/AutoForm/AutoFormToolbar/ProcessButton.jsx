import React from 'react';
import PropTypes from 'prop-types';

import BasicButton from '../../BasicButton';

const ProcessButton = ({ children, className, onClick, disabled, showValidationMessages }) => (
  <BasicButton
    type="button"
    className={className}
    onClick={onClick}
    showValidationMessages={showValidationMessages}
    disabled={disabled}>{children}</BasicButton>
);

ProcessButton.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
  showValidationMessages: PropTypes.bool,
  
  children: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
    PropTypes.element,
    PropTypes.arrayOf(
      PropTypes.oneOfType([
        PropTypes.bool,
        PropTypes.string,
        PropTypes.element]))
  ])
}

export default ProcessButton