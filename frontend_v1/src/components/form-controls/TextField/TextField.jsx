import React from 'react';
import PropTypes from 'prop-types';
import { FormGroup, Label, Input} from 'reactstrap';

import { internalFieldNames } from '../../AutoForm';
import ValidationMessages from '../ValidationMessages';

class TextField extends React.Component {
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

  onBlur = (event) => {
    if(this.props.onBlur) {
      this.props.onBlur(event);
    }
  }

  setInputRef = (ref) => {
    if(!this.inputRef && ref) {
      ref.value = this.props.value;
    }
    this.inputRef = ref;
  }

  render() {
    const { type, disabled, onChange, label, value, validationMessages, isDirty, valuePath, validationState, providesSuggestedMetadata, autoTrimText, changeCount, ...other } = this.props
    const mergedIsDirty = isDirty || this.state.isDirty;
    const showValidationMessages = (mergedIsDirty && validationMessages && validationMessages.length > 0);

    return (
      <FormGroup className={`o-form-control o-form-control-text-field ${ disabled ? 'disabled' : '' }`}>
        { !label ? null : <Label>{label}</Label>}

        <Input type="text" 
                onChange={this.onChange}
                onBlur={this.onBlur}
                invalid={showValidationMessages} 
                disabled={disabled}
                innerRef={this.setInputRef}
                {...other} />
        
        {showValidationMessages && ( <ValidationMessages value={validationMessages} /> )}
      </FormGroup>
    )
  }
}

TextField[internalFieldNames.COMPONENT_NAME] = 'TextField';

TextField.propTypes = {
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

export default TextField;