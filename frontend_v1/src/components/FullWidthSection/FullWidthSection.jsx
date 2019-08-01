import React from 'react';

import "./FullWidthSection.scss";

const FullWidthSection = (props) => {
  const { children, className } = props;
  return (

    <div className={`o-full-width-section ${className}`}>
      <div className="o-full-width-section-content">
        {children}
      </div>
    </div>


  );
  }

export default FullWidthSection;