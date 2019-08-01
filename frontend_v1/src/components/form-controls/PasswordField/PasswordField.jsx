import React from 'react';
import PropTypes from 'prop-types';
import { FormGroup, Label, Input} from 'reactstrap';

import ValidationMessages from '../ValidationMessages';
import { internalFieldNames } from '../../AutoForm';

class PasswordField extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isDirty: !!props.isDirty
    };
    this.inputRef = null;
  }

  onChange = (event) => {
    if(!this.props.disabled) {
      const { value } = event.target;
      this.setState({ isDirty: true });
      this.props.onChange(value);
    }
  }

  setInputRef = (ref) => {
    if(!this.inputRef && ref) {
      ref.value = this.props.value;
    }
    this.inputRef = ref;
  }

  render() {
    const { type, disabled, onChange, label, value, valuePath, validationState, validationMessages, isDirty, changeCount, ...other } = this.props
    const mergedIsDirty = isDirty || this.state.isDirty;
    const showValidationMessages = (mergedIsDirty && validationMessages && validationMessages.length > 0);

    if(!disabled) {
      return (
        <FormGroup className="o-form-control o-form-control-text-field">
          { !label ? null : <Label>{label}</Label>}

          <Input type="password" 
                 value={value} 
                 onChange={this.onChange}
                 invalid={showValidationMessages} 
                 disabled={disabled}
                 innerRef={this.setInputRef}
                 {...other} />
          
          {showValidationMessages && ( <ValidationMessages value={validationMessages} /> )}
        </FormGroup>
      )
    }
    
    return (<div className="o-form-control o-form-control-text-field">{value}</div>)
  }
}

PasswordField[internalFieldNames.COMPONENT_NAME] = 'PasswordField';

PasswordField.propTypes = {
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
}

export default PasswordField;