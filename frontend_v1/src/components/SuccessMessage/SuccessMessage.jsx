import React from 'react';
import PropTypes from 'prop-types';
import Toolbar from '../Toolbar';
import BasicButton from '../BasicButton';

import './SuccessMessage.scss';

const SuccessMessage = (props) => {
  const { children, onDismiss } = props;
  const dismissButtonText = props.dismissButtonText || 'OK';

  return (
    <div className="o-success-message-container">
      <div className="o-success-message">
        {
          // default to sending back children that were passed in
          children
          // Otherwise send back a default display
          || (
            <h1>Success!</h1>
          )
        }
      </div>
      
      <Toolbar>
        <BasicButton
          className="o-button-center"
          type="button"
          onClick={onDismiss}>{dismissButtonText}</BasicButton>
      </Toolbar>
    </div>
  );
}

SuccessMessage.propTypes = {
  children: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
  dismissButtonText: PropTypes.string,
  onDismiss: PropTypes.func.isRequired
}

export default SuccessMessage