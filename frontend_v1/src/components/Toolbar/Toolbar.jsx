import React from 'react';
import PropTypes from 'prop-types';

import { StringBuilder } from '../../utilities/StringUtilities';

import "./Toolbar.scss";

const Toolbar = ({ 
  children,
  side,
  align,
  position,
  textAlign,
  enableResponsivePageContainer,
  className,
  contentsClassName
}) => {

  const classesBuilder = new StringBuilder();
  classesBuilder.append('o-toolbar');
  
  if(side) { classesBuilder.append(` o-toolbar-${side}`); }
  if(align) { classesBuilder.append(` o-toolbar-align-${align}`); }
  if(className) { classesBuilder.append(` ${className}`) }
  if(position) { classesBuilder.append(` o-toolbar-position-${position}`); }
  if(enableResponsivePageContainer) { classesBuilder.append(` o-responsive-page-container`); }

  return (
    <div className={classesBuilder.toString()}>
      <div className={`o-toolbar-contents ${textAlign ? `text-${textAlign}` : ''} ${contentsClassName || ''}`}>
        {children}
      </div>
    </div>
  );
};

Toolbar.propTypes = {
  children: 
    PropTypes.oneOfType([
      PropTypes.element, 
      PropTypes.bool,
      PropTypes.arrayOf(
        PropTypes.oneOfType([
          PropTypes.element,
          PropTypes.bool
        ])
      ),
    ]),

  side: PropTypes.oneOf(['top','bottom','left','right']),
  align: PropTypes.oneOf(['top','bottom','left','right']),
  position: PropTypes.oneOf(['absolute','fixed']),
  textAlign: PropTypes.oneOf(['left','center','right','justify']),
  enableResponsivePageContainer: PropTypes.bool,
  className: PropTypes.string,
  contentsClassName: PropTypes.string
}

export default Toolbar;