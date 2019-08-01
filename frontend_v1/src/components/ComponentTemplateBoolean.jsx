import React from 'react';
import PropTypes from 'prop-types';

import "./ComponentName.scss";

const Page = ({ children, className, componentSpecial }) => (
  <div className={`o-component ${className}`}>
    {componentSpecial ? (
        <div className="o-component-special">
          {children}
        </div>
      ) : (
        <div>
          {children}
        </div>
      )}
  </div>
);

Page.propTypes = {
  children: 
    PropTypes.oneOfType([
      PropTypes.element, 
      PropTypes.arrayOf(PropTypes.element)
    ]).isRequired,
  className: PropTypes.string,
  componentSpecial: PropTypes.bool,
}

export default ComponentName;