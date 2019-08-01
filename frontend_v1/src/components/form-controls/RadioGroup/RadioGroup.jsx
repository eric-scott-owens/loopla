import React from 'react';
import PropTypes from 'prop-types';
import { FormGroup, Label, Input} from 'reactstrap';

import ValidationMessages from '../ValidationMessages';
import { internalFieldNames } from '../../AutoForm';

class RadioGroup extends React.Component {
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
    const { type, disabled, name, onChange, label, value, options, validationMessages, validationState, isDirty, valuePath, changeCount, ...other } = this.props
    const mergedIsDirty = isDirty || this.state.isDirty;
    const showValidationMessages = (mergedIsDirty && validationMessages && validationMessages.length > 0);

    return (
      <FormGroup className={`o-form-control o-form-control-radio-group ${ disabled ? 'disabled' : '' }`}>
        { !label ? null : <Label>{label}</Label>}

        {!options ? null : options.map(option => (
          <div className="form-check" key={`radio-group:${name}:${option.value}`}>
            <Input
              type="radio"
              className="form-check-input o-radio-group"
              name={name}
              id={option.title}
              value={option.value}
              checked={`${option.value}` === value}
              onChange={this.onChange}
              disabled={disabled}
              {...other}
            />

            <Label
              className="form-check-label"
              for={option.value}
              onClick={() => { this.onChange({ target: { value: option.value }}); } }
            >
              <div className="o-radio-group-option-title">{option.title}</div>
              { option.description && (<span className="o-radio-group-option-description">{option.description}</span>) }
            </Label>

          </div>
        ))}
        
        {showValidationMessages && ( <ValidationMessages value={validationMessages} /> )}
      </FormGroup>
    );
  }
}

RadioGroup[internalFieldNames.COMPONENT_NAME] = 'RadioGroup';

RadioGroup.propTypes = {
  disabled: PropTypes.bool,
  label: PropTypes.string,
  name: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string
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

export default RadioGroup;