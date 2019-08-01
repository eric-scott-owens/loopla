import React from 'react';
import PropTypes from "prop-types";
import { withRouter } from 'react-router-dom';
import Toggle from 'react-toggle';
import { Label } from 'reactstrap';

import { internalFieldNames } from '../../AutoForm';
import ValidationMessages from '../ValidationMessages';

import 'react-toggle/style.css';
import "./ToggleControl.scss";


class ToggleControl extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isDirty: !!props.isDirty
    };
  }

  onChange = (event) => {
    if(!this.props.disabled) {
      const { checked } = event.target;
      this.setState({ isDirty: true });

      if(this.props.onChange) {
        this.props.onChange(checked);
      }
    }
  }

  render() {
    const { value, disabled, label, children, isDirty, validationMessages, className, inline } = this.props;
    const mergedIsDirty = isDirty || this.state.isDirty;
    const showValidationMessages = (mergedIsDirty && validationMessages && validationMessages.length > 0);

    return (
      <div className={`o-toggle-control ${className} ${inline ? 'o-toggle-control-inline' : ''} ${disabled ? 'disabled' : ''}`}>
        <Toggle
          checked={value}
          onChange={this.onChange}
          disabled={disabled} />
        
        { (label || children) && (
          <Label onClick={() => { this.onChange({ target: { checked: !value }}); } }>
            <React.Fragment>
              {label}
              {children}
            </React.Fragment>
          </Label>
        )}
        
        {!showValidationMessages ? null : (
          <ValidationMessages value={validationMessages} />
        )}
      </div>
    );
  }
} 

ToggleControl[internalFieldNames.COMPONENT_NAME] = 'ToggleControl';

ToggleControl.propTypes = {
  // eslint-disable-next-line
  valuePath: (props, propName, componentName, location) => {
    if(!props.valuePath && props.value === undefined) {
      return new Error(`One of props '${propName}' or 'value' was not specified in ${componentName}.`);
    }

    const typeOfValuePath = typeof props.valuePath;
    if(props.valuePath && typeOfValuePath !== 'string') {
      return new Error(`Invalid ${location} '${propName}' of type '${typeOfValuePath}' supplied to '${componentName}', expected 'string'.`);
    }

    return undefined;
  },
  value: (props, propName, componentName, location) => {
    if(props.value === undefined && !props.valuePath) {
      return new Error(`One of props '${propName}' or 'valuePath' was not specified in ${componentName}.`);
    }
    
    const typeOfValue = typeof props.value;
    if(props.value && typeOfValue !== 'boolean') {
      return new Error(`Invalid ${location} '${propName}' of type '${typeOfValue}' supplied to '${componentName}', expected 'boolean'.`);
    }

    return undefined;
  },
  disabled: PropTypes.bool,
  label: PropTypes.string,
  children: PropTypes.element,
  className: PropTypes.string,
  validationMessages: PropTypes.arrayOf(PropTypes.string),
  inline: PropTypes.bool
}

export default withRouter(ToggleControl);
