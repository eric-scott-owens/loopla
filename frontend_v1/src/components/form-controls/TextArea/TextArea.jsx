import React from 'react';
import PropTypes from 'prop-types';
import { FormGroup, Label, Input } from 'reactstrap';

import { internalFieldNames } from '../../AutoForm';
import ValidationMessages from '../ValidationMessages';

class TextArea extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isDirty: !!props.isDirty
    };
    this.inputRef = null;
  }

  componentDidMount() {
    if (!this.props.noAutoExpanding) {
      this.updateComputedHeight();
    }

    setTimeout(() => {
      this.updateComputedHeight();
    }, 10);
  }

  onChange = (event) => {
    if(!this.props.disabled) {
      const { value } = event.target;
      this.setState({ isDirty: true });

      if (!this.props.noAutoExpanding) {
        this.updateComputedHeight();
      }

      if(this.props.onChange) {
        this.props.onChange(value);
      }
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

  updateComputedHeight() {
    if(this.inputRef) {
      this.inputRef.style.height = 'inherit';
      this.inputRef.style.height = `${this.inputRef.scrollHeight}px`;
    }
  }

  render() {
    const { type, disabled, onChange, label, value, onBlur, validationMessages, isDirty, editingObject, valuePath, validationState, providesSuggestedMetadata, noAutoExpanding, autoTrimText, changeCount, ...other } = this.props;
    const mergedIsDirty = isDirty || this.state.isDirty;
    const showValidationMessages = (mergedIsDirty && validationMessages && validationMessages.length > 0);

    return (
      <FormGroup className={`o-form-control o-form-control-text-field ${ disabled ? 'disabled' : '' }`}>
        { !label ? null : <Label>{label}</Label>}
        
        <Input type="textarea" 
          onChange={this.onChange}
          onBlur={this.onBlur}
          invalid={showValidationMessages}
          disabled={disabled}
          innerRef={this.setInputRef}
          {...other} />

        {!showValidationMessages ? null : (
          <ValidationMessages value={validationMessages} />
        )}
      </FormGroup>
    )
  }
}

TextArea[internalFieldNames.COMPONENT_NAME] = 'TextArea';

TextArea.propTypes = {
  disabled: PropTypes.bool,
  noAutoExpanding: PropTypes.bool,
  label: PropTypes.string,
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

export default TextArea;