import React from 'react';
import PropTypes from 'prop-types';

import { navigateTo } from '../../containers/history/AppNavigationHistoryService';

import "../IconButton/IconButton.scss";
import "./IconTextButton.scss";

class IconTextButton extends React.Component {

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
    const { 
      children, className, text, textWidth, orientation, linkTo, onClick, color, shape, staticContext, isActive, ...other } = this.props;
    
    const textWrapperStyle = {}
    if(textWidth) {
      if(orientation === 'vertical') {
        textWrapperStyle.height = textWidth;
      } else {
        textWrapperStyle.width = textWidth;
      }
    }

    return (
      <button 
        type="button"
        to={linkTo}
        onClick={this.onClick}
        className={`o-icon-text-button ${className || ''} ${orientation || ''} ${isActive && 'is-active'}`}
        {...other}
      >
        <div className="o-button-wrapper">
          <div className={`o-icon-button ${shape || ''} ${color  && `o-icon-button-${color}`}`}>
            { children }
          </div>
        </div>
        <div className="o-text-wrapper" style={textWrapperStyle}>
          { text }
        </div>
      </button>
    );
  }

}

IconTextButton.propTypes = {
  // General
  text: PropTypes.string.isRequired, // The contents placed into the text area
  textWidth: PropTypes.string, // optionally defines space to give div container for text, must be a valid css width value
  className: PropTypes.string,  
  orientation: PropTypes.oneOf(['vertical']),

  // The contents placed into the button
  children: 
    PropTypes.oneOfType([
      PropTypes.element, 
      PropTypes.string,
      PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.element, PropTypes.string]))
    ]).isRequired,

  linkTo: PropTypes.string,
  shape: PropTypes.oneOf(['circle', 'square']),
  color: PropTypes.oneOf(['default', 'primary', 'secondary', undefined]),
  isActive: PropTypes.bool
}

export default IconTextButton;