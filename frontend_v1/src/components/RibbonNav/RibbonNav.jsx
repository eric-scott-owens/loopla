import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import throttle from 'lodash/throttle';

import { addBodyClass, removeBodyClass } from '../../utilities/StyleUtilities';
import configuration from '../../configuration';

import './RibbonNav.scss';

const CLASS_NAMES = {
  ribbonNav: {
    fixed: 'o-ribbon-nav-fixed'
  }
}

/**
 * Updates the loop header size when the user has scrolled
 * down the page
 */
const updateRibbonNavStickiness = throttle(() => {
  if(window.pageYOffset > 25) {
    addBodyClass(CLASS_NAMES.ribbonNav.fixed);
  }
  else {
    removeBodyClass(CLASS_NAMES.ribbonNav.fixed);
  }  
}, configuration.scrollThrottle.maxWait);

class RibbonNav extends React.Component {

  componentDidMount() {
    const { notSticky } = this.props;
    if(!notSticky) {
      window.addEventListener('scroll', updateRibbonNavStickiness);
      addBodyClass('o-has-sticky-ribbon-nav');
    }
  }

  shouldComponentUpdate(nextProps) {
    if((this.props.notSticky === false) && (nextProps.notSticky === true)) {
      removeBodyClass(CLASS_NAMES.ribbonNav.fixed)
      window.removeEventListener('scroll', updateRibbonNavStickiness);
      removeBodyClass('o-has-sticky-ribbon-nav');
    }
    
    if((this.props.notSticky === true) && (nextProps.notSticky === false)) {
      window.addEventListener('scroll', updateRibbonNavStickiness);
      updateRibbonNavStickiness();
      addBodyClass('o-has-sticky-ribbon-nav');
    }

    return true;
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', updateRibbonNavStickiness);
    removeBodyClass('o-has-sticky-ribbon-nav');
  }

  onClick = (event, ...args) => {
    if (this.props.onClick) {
      this.props.onClick(event, ...args);
    } 
    else {
      this.props.history.goBack();
    }
  }

  render() {
    const {children, className, color, notSticky} = this.props;


    return (
      <div className={`o-ribbon-nav-container ${notSticky ? '' : 'ribbon-nav-sticky'} text-left`}>
        <button
          className={`ribbon-nav ${color ? `ribbon-nav-${color}` : 'ribbon-nav-default'} ${className || ''}`}
          type="button"
          onClick={this.onClick}
          ><div className="o-ribbon-text-container"><div className="o-ribbon-text">{children || "Back"}</div></div></button>
      </div>
    );
    
  }
} 

RibbonNav.propTypes = {
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.element, PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.element]))]),
  className: PropTypes.string,
  onClick: PropTypes.func,
  color: PropTypes.oneOf(['primary','secondary','warning','danger','loop','user']),
  notSticky: PropTypes.bool
}

export default withRouter(RibbonNav);