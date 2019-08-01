import React from 'react';
import PropTypes from "prop-types";
import Error from '@material-ui/icons/Error';
import { Button } from 'reactstrap';

import { navigateTo } from '../../containers/history/AppNavigationHistoryService';

import "./BasicButton.scss";

class BasicButton extends React.Component {
  onClick = (event) => {
    const { linkTo, onClick, href, target } = this.props;
    
    if(onClick) {
      onClick(event);
    }
    
    if(linkTo) {
      navigateTo(linkTo);
    }
    
    if(href) {
      event.preventDefault();
      window.open(href, target);
    }
  }
  
  render() {
    const { children, color, linkTo, onClick, staticContext, href, target, showValidationMessages, isActive, ...other } = this.props;
    return (
      <span>
        <Button
          color={color || 'primary'}
          to={linkTo}
          onClick={this.onClick}
          className={`o-basic-button${isActive && ' is-active'}`}
          {...other} >
            { children }
        </Button>
        {showValidationMessages && <span className="o-button-error-alert"><Error />Fix errors above</span>}
      </span>
    );
  }

} 

BasicButton.propTypes = {
  children: 
    PropTypes.oneOfType([
      PropTypes.element, 
      PropTypes.string,
      PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.element, PropTypes.string]))
    ]).isRequired,
  className: PropTypes.string,
  color: PropTypes.oneOf(['primary', 'secondary', 'success', 'info', 'warning', 'danger', 'link', 'mini', undefined]),
  isActive: PropTypes.bool,
  linkTo: PropTypes.string,
  href: PropTypes.string,
  target: PropTypes.oneOf(['_blank','_self','_parent','_top']),
  showValidationMessages: PropTypes.bool
}

export default BasicButton;