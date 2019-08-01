import React from 'react';
import PropTypes from 'prop-types';
import { FormFeedback } from 'reactstrap';

import './ValidationMessages.scss';

const ValidationMessages = ({value}) => (
  <FormFeedback className='o-validation-messages'>
    {value && value.map((message) => (<span key={message}>{message}</span>))}
  </FormFeedback>
);

ValidationMessages.propTypes = {
  value: PropTypes.arrayOf(PropTypes.string)
};

export default ValidationMessages;