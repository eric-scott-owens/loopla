import React from 'react';
import PropTypes from 'prop-types';
import { FormGroup, Label } from 'reactstrap';

import PhoneInput from 'react-phone-number-input';
import SmartInput from 'react-phone-number-input/smart-input';
import ValidationMessages from '../ValidationMessages';
import { internalFieldNames } from '../../AutoForm';

import 'react-phone-number-input/style.css';
import "./PhoneNumberField.scss";

class PhoneNumberField extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isDirty: !!props.isDirty
    };
    this.inputRef = null;
  }

  onChange = (event) => {
    if(!this.props.disabled) {
      this.setState({ isDirty: true });
      if(event === undefined) {
        event = null;
      }
      this.props.onChange(event);
    }
  }

  onBlur = (event) => {
    if(this.props.onBlur) {
      this.props.onBlur(event);
    }
  }

  render() {
    const { type, disabled, onChange, label, value, validationMessages, isDirty, valuePath, validationState, providesSuggestedMetadata, changeCount, ...other } = this.props
    const mergedIsDirty = isDirty || this.state.isDirty;
    const showValidationMessages = (mergedIsDirty && validationMessages && validationMessages.length > 0);

    return (
      <FormGroup className={`o-phone-number-field o-form-control o-form-control-text-field ${ disabled ? 'disabled' : '' }`}>
        { !label ? null : <Label>{label}</Label>}

        <PhoneInput
          inputComponent={ SmartInput }
          placeholder="Phone Number"
          value={value}
          onChange={ this.onChange }
          country="US" // default the country to USA
          />
        
        {showValidationMessages && ( <ValidationMessages value={validationMessages} /> )}
      </FormGroup>
    )
  }
}

PhoneNumberField[internalFieldNames.COMPONENT_NAME] = 'PhoneNumberField';

PhoneNumberField.propTypes = {
  label: PropTypes.string,
  disabled: PropTypes.bool,
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
    if(props.value && typeOfValue !== 'string') {
      return new Error(`Invalid ${location} '${propName}' of type '${typeOfValue}' supplied to '${componentName}', expected 'string'.`);
    }

    return undefined;
  },
  onChange:  (props, propName, componentName, location) => {
    if(props.onChange === undefined && !props.valuePath) {
      return new Error(`One of props '${propName}' or 'valuePath' was not specified in ${componentName}.`);
    }

    const typeOfValue = typeof props.onChange;
    if(props.value && typeOfValue !== 'function') {
      return new Error(`Invalid ${location} '${propName}' of type '${typeOfValue}' supplied to '${componentName}', expected 'function'.`);
    }

    return undefined;
  },
  validationMessages: PropTypes.arrayOf(PropTypes.string),
  providesSuggestedMetadata: PropTypes.bool // This flags AutoForm to wire up suggested tags
}

export default PhoneNumberField;