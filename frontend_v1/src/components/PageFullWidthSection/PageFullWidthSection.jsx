import React from 'react';
import PropTypes from 'prop-types';
import { UncontrolledCollapse, Collapse } from 'reactstrap';

import "./PageFullWidthSection.scss";

const PageFullWidthSection = (props) => {
  const { children, className, isOpen, toggler, ...others } = props;

  let contentSection = (
    <div className="o-page-full-width-section-content">
      {children}
    </div>
  );

  if(isOpen !== undefined) {
    contentSection = (<Collapse isOpen={isOpen}>{contentSection}</Collapse>);
  } else if(toggler) {
    contentSection = (<UncontrolledCollapse toggler={toggler}>{contentSection}</UncontrolledCollapse>);
  }

  return  (
    <div className={`o-page-full-width-section ${className || ''}`} {...others} >
      {contentSection}
    </div>
  );
  }

PageFullWidthSection.propTypes = {
  // NOTE: 
  //    You can use only one of the collapse methods
  //    If both are present isOpen will be used
  isOpen: PropTypes.bool, // Bound method to control the collapse state of the component
  toggler: PropTypes.string // Unbound target controlling the collapse state of the component
};

export default PageFullWidthSection;