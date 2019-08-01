import React from 'react';
import PropTypes from 'prop-types';

import "./Page.scss";

const Page = ({ children, className }) => (
  <div className={`o-page ${className || ''}`}>
    {children}
  </div>
);

Page.propTypes = {
  children: 
    PropTypes.oneOfType([
      PropTypes.element, 
      PropTypes.string,
      PropTypes.bool,
      PropTypes.arrayOf(
        PropTypes.oneOfType([
          PropTypes.element, 
          PropTypes.string,
          PropTypes.bool
        ])
      )
    ]).isRequired,
  className: PropTypes.string
}

export default Page;