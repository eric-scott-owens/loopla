import React from 'react';
import PropTypes from 'prop-types';
import { formatPersonName } from '../../utilities/StringUtilities';
import TextFinder from '../TextFinder';

import "./PersonNameFormatter.scss";

const PersonNameFormatter = ({ firstName, middleName, lastName, showFirstNameOnly }) => {
  const displayName = 
    showFirstNameOnly ? 
      firstName : 
      formatPersonName(firstName, middleName, lastName);
  
  return (
    <span className="o-person-name">
      <TextFinder>
        {displayName || ' '}
      </TextFinder>
    </span>
  );
};

PersonNameFormatter.propTypes = {
  firstName: PropTypes.string,
  middleName: PropTypes.string,
  lastName: PropTypes.string,
  showFirstNameOnly: PropTypes.bool
}

export default PersonNameFormatter;