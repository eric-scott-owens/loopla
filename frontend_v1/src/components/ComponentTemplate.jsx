import React from 'react';

const PageFullWidthContainer = (props) => {
  const { children, className } = props;
  return (
    <div className={`o-page-full-width-container ${className}`}>
     {children}
   </div>
  );
  }


export default PageFullWidthContainer;