import React from 'react';
import PropTypes from 'prop-types';

import BasicButton from '../../BasicButton';

const CancelButton = ({ children, className, onClick, disabled }) => (
  <BasicButton 
    color="secondary" 
    className={className}
    onClick={onClick} 
    disabled={disabled}>{children || 'Cancel'}</BasicButton>
);

CancelButton.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
  
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

export default CancelButton