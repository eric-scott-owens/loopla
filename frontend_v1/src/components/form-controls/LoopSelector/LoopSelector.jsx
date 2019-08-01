import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import forEach from 'lodash/forEach';
import SelectList from '../SelectList';
import { internalFieldNames } from '../../AutoForm';

import "./LoopSelector.scss";

class LoopSelector extends React.Component {

  onChange = (value) => {
    this.props.onChange(value);
  }

  render() {
    const { groups, value, label, disabled, onChange, validationMessages, validationState, isDirty, valuePath, allowAllLoops, groupIds, changeCount, ...other } = this.props;
    const groupOptions = groups.map((group) => ({ value: group.id, text: group.name }));
    if (allowAllLoops) { 
      groupOptions.unshift({value: 0, text: "All Loops"})
    }
    return (
      <SelectList
        className="o-loop-selector"
        valuePath={valuePath}
        value={value}
        label={label}
        placeholder="Select loop"
        onChange={this.onChange}
        options={groupOptions}
        validationMessages={validationMessages}
        isDirty={isDirty}
        disabled={disabled}
        {...other} />

    )
  }
} 

LoopSelector.propTypes = {
  allowAllLoops: PropTypes.bool,
  disabled: PropTypes.bool,
  groupIds: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number])).isRequired,
  
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

const mapStateToProps = (state, props) => {
  const { groups } = state;
  const { groupIds } = props;
  const userGroups = [];
  forEach(groupIds, groupId => {
    const group = groups[groupId];
    if(group) {
      userGroups.push(group);
    }
  });

  return { groups: userGroups }
}


const ConnectedLoopSelector = connect(mapStateToProps)(LoopSelector);
ConnectedLoopSelector[internalFieldNames.COMPONENT_NAME] = 'LoopSelector';
export default ConnectedLoopSelector;