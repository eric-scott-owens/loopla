import React from 'react';
import PropTypes from "prop-types";

import { navigateTo } from '../../containers/history/AppNavigationHistoryService';

import "./IconButton.scss";

class IconButton extends React.Component {

  onClick = (event) => {
    const { linkTo, onClick } = this.props;
    
    if(onClick) {
      onClick(event);
    }
    
    if(linkTo) {
      navigateTo(linkTo);
    }
  }

  render() {
    const { children, className, linkTo, onClick, color, shape, staticContext, isActive, ...other } = this.props;
    return (
      <button
        type="button"
        to={linkTo}
        onClick={this.onClick}
        className={`o-icon-button${className ? ` ${className}` : ''}${shape ? ` ${shape}` : ''}${color ? ` o-icon-button-${color}` : ''}${isActive ? ' is-active' : ''}`}
        {...other} >
          { children }
      </button>
    );
  }

}

IconButton.propTypes = {
  children: 
    PropTypes.oneOfType([
      PropTypes.element, 
      PropTypes.string,
      PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.element, PropTypes.string]))
    ]).isRequired,
  className: PropTypes.string,
  linkTo: PropTypes.string,
  shape: PropTypes.oneOf(['circle', 'square']),
  color: PropTypes.oneOf(['default', 'primary', 'secondary', undefined]),
  isActive: PropTypes.bool
}

export default IconButton;