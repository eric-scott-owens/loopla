import React from 'react';
import PropTypes from 'prop-types';
import { padEnd } from '../../utilities/StringUtilities';

const Currency = ({ value }) => {
  // Value must be an integer representing USD cents
  const dollars = Math.floor(value / 100);
  const cents = `${(value % 100)}`;
  const displayCents = padEnd(`${cents}`, 2, '0');
  
  return (<span className="currency">${dollars}.{displayCents}</span>)
}

Currency.propTypes = {
  value: PropTypes.number // Must be an integer representing USD cents. for example $3.42 == 342
}

export default Currency