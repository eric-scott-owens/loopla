import React from 'react';
import PropTypes from 'prop-types';
import { internalFieldNames } from '../../AutoForm';
import SelectList from '../SelectList';

class StateSelector extends React.Component {

  onChange = (value) => {
    this.props.onChange(value);
  }

  createStateOptions = () => {
    const stateOptions = [
      {value: "AL", text: "Alabama"},
      {value: "AK", text: "Alaska"},
      {value: "AS", text: "American Samoa"},
      {value: "AZ", text: "Arizona"},
      {value: "AR", text: "Arkansas"},
      {value: "CA", text: "California"},
      {value: "CO", text: "Colorado"},
      {value: "CT", text: "Connecticut"},
      {value: "DE", text: "Delaware"},
      {value: "DC", text: "District of Columbia"},
      {value: "FM", text: "Federated States of Micronesia"},
      {value: "FL", text: "Florida"},
      {value: "GA", text: "Georgia"},
      {value: "GU", text: "Guam"},
      {value: "HI", text: "Hawaii"},
      {value: "ID", text: "Idaho"},
      {value: "IL", text: "Illinois"},
      {value: "IN", text: "Indiana"},
      {value: "IA", text: "Iowa"},
      {value: "KS", text: "Kansas"},
      {value: "KY", text: "Kentucky"},
      {value: "LA", text: "Louisiana"},
      {value: "ME", text: "Maine"},
      {value: "MD", text: "Maryland"},
      {value: "MH", text: "Marshall Islands"},
      {value: "MA", text: "Massachusetts"},
      {value: "MI", text: "Michigan"},
      {value: "MN", text: "Minnesota"},
      {value: "MS", text: "Mississippi"},
      {value: "MO", text: "Missouri"},
      {value: "MT", text: "Montana"},
      {value: "NE", text: "Nebraska"},
      {value: "NV", text: "Nevada"},
      {value: "NH", text: "New Hampshire"},
      {value: "NJ", text: "New Jersey"},
      {value: "NM", text: "New Mexico"},
      {value: "NY", text: "New York"},
      {value: "NC", text: "North Carolina"},
      {value: "ND", text: "North Dakota"},
      {value: "MP", text: "Northern Mariana Islands"},
      {value: "OH", text: "Ohio"},
      {value: "OK", text: "Oklahoma"},
      {value: "OR", text: "Oregon"},
      {value: "PW", text: "Palau"},
      {value: "PA", text: "Pennsylvania"},
      {value: "PR", text: "Puerto Rico"},
      {value: "RI", text: "Rhode Island"},
      {value: "SC", text: "South Carolina"},
      {value: "SD", text: "South Dakota"},
      {value: "TN", text: "Tennessee"},
      {value: "TX", text: "Texas"},
      {value: "UT", text: "Utah"},
      {value: "VT", text: "Vermont"},
      {value: "VI", text: "Virgin Islands"},
      {value: "VA", text: "Virginia"},
      {value: "WA", text: "Washington"},
      {value: "WV", text: "West Virginia"},
      {value: "WI", text: "Wisconsin"},
      {value: "WY", text: "Wyoming"},
    ]

    return stateOptions;
  }

  render() {
    const { value, label, disabled, onChange, validationMessages, validationState, isDirty, valuePath, changeCount, ...other } = this.props;
    const stateOptions = this.createStateOptions();
    return (
      <SelectList
        className="o-state-selector"
        valuePath={valuePath}
        value={value}
        label={label}
        placeholder="State"
        onChange={this.onChange}
        options={stateOptions}
        validationMessages={validationMessages}
        isDirty={isDirty}
        disabled={disabled}
        {...other} />

    )
  }
} 

StateSelector[internalFieldNames.COMPONENT_NAME] = 'StateSelector';

StateSelector.propTypes = {
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
  validationMessages: PropTypes.arrayOf(PropTypes.string)
};

export default StateSelector;