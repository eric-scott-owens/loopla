import React from 'react';
import PropTypes from 'prop-types';
import Toolbar from '../../Toolbar';
import CancelButton from './CancelButton';
import ProcessButton from './ProcessButton';


const AutoFormToolbar = ({ 
  isProcessing,
  className,
  align,
  showValidationMessages,

  onCancel,
  cancelButtonClassName,
  cancelButtonText,

  onProcess,
  processingButtonClassName,
  processingButtonText
}) => (
  <Toolbar className={className} textAlign={align || 'right'}>
    {onCancel && (
      <CancelButton
        className={cancelButtonClassName}
        onClick={onCancel} 
        disabled={isProcessing}>{cancelButtonText}</CancelButton>
    )}

    <ProcessButton
      className={processingButtonClassName}
      onClick={onProcess}
      showValidationMessages={showValidationMessages}
      disabled={isProcessing}>{processingButtonText}</ProcessButton>
    
  </Toolbar>
);

AutoFormToolbar.propTypes = {
  isProcessing: PropTypes.bool.isRequired,
  className: PropTypes.string,
  align: PropTypes.string,
  showValidationMessages: PropTypes.bool,

  onCancel: PropTypes.func,
  cancelButtonClassName: PropTypes.string,
  cancelButtonText: PropTypes.string,

  onProcess: PropTypes.func.isRequired,
  processingButtonClassName: PropTypes.string,
  processingButtonText: PropTypes.string
};

export default AutoFormToolbar;