import React from 'react';
import PropTypes from 'prop-types';
import { FormGroup, Label, Input} from 'reactstrap';

import { internalFieldNames } from '../../AutoForm';
import ValidationMessages from '../ValidationMessages';

import './SelectList.scss';

class SelectList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isDirty: !!props.isDirty
    };
  }

  onChange = (event) => {
    if(!this.props.disabled) {
      const { value } = event.target;
      this.setState({ isDirty: true });
      this.props.onChange(value);
    }
  }

  render() {
    const { type, disabled, onChange, label, value, options, placeholder, validationMessages, validationState, isDirty, valuePath, changeCount, ...other } = this.props
    const mergedIsDirty = isDirty || this.state.isDirty;
    const normalizedValue = value || -1;
    const showValidationMessages = (mergedIsDirty && validationMessages && validationMessages.length > 0);

    return (
      <FormGroup className="o-form-control o-select-list" disabled={disabled}>
        { !label ? null : <Label>{label}</Label>}
        <Input 
          type="select" 
          value={normalizedValue} 
          onChange={this.onChange} 
          invalid={showValidationMessages} 
          disabled={disabled}
          {...other}
        >
          {!placeholder ? null : (<option value={-1} disabled>{placeholder}</option>) }
          {!options ? null : options.map(option => (
            <option value={option.value} key={option.value} disabled={disabled} >{option.text ? option.text : option.value}</option>
          ))}
        </Input>

        {showValidationMessages && ( <ValidationMessages value={validationMessages} /> )}
      </FormGroup>
    );
  }
}

SelectList[internalFieldNames.COMPONENT_NAME] = 'SelectList';

SelectList.propTypes = {
  disabled: PropTypes.bool,
  label: PropTypes.string,
  options: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    text: PropTypes.string
  })).isRequired,
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
    if(props.value && typeOfValue !== 'string' && typeOfValue !== 'number') {
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
  validationMessages: PropTypes.arrayOf(PropTypes.string)
}

export default SelectList;