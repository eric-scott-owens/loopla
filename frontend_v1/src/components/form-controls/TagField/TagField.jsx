import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormGroup, Label, Input} from 'reactstrap';
import get from 'lodash/get';

import configuration from '../../../configuration';
import { isNullOrWhitespace } from '../../../utilities/StringUtilities';
import { VALIDATION_PROCESSING_STATE as processingStates } from '../../../reducers/validation';
import { internalFieldNames, RETRY_USER_UI_INTERACTION_COMMAND_DELAY } from '../../AutoForm';
import Tag from '../../Tag';
import ValidationMessages from '../ValidationMessages';

import "./TagField.scss";
import { getBlankModelFor } from '../../../utilities/ObjectUtilities';


class TagField extends React.Component {
  constructor(props) {
    super(props);
    this.displayName = 'TagFieldChanged';
    this.state = {
      isDirty: !!props.isDirty,
      hasValueAwaitingAddition: false
    }
  }

  onNewTagTextChange = (event) => {
    const { value } = event.target;
    this.props.onNewTagNameChange(value);
    this.setState({ isDirty: true, hasValueAwaitingAddition: !isNullOrWhitespace(value) });
  }
  
  deleteTag = (tag) => {
    this.props.onDeleteTag(tag);
  }

  addTag = (tagName, event) => {
    const { validationState, validationMessages } = this.props;

    if (
      !validationState || 
      validationState.validationProcessingState !== processingStates.complete
    ) {
      // If validation isn't complete, come back later
      setTimeout(() => { this.addTag(tagName, event); }, RETRY_USER_UI_INTERACTION_COMMAND_DELAY);
      return;
    }

    const newTag = getBlankModelFor(configuration.MODEL_TYPES.tag);
    newTag.isUserGenerated = true;
    newTag.name = tagName;

    const { selectedTags } = this.props;
    const matchingTags = selectedTags.filter(t => t.name === newTag.name);

    if(
      !isNullOrWhitespace(tagName) && 
      matchingTags.length === 0 &&
      (validationMessages.length === 0)
    ) {
      // Add the tag and reset the isDirty flag
      this.props.onAddValidatedTag(newTag);
      this.setState({ isDirty: false, hasValueAwaitingAddition: false });

      // eslint-disable-next-line
      event.target.value = '';
    }
  }

  handleKeyPress = (event) => {
    if(event.key === "Enter") {
      event.preventDefault();
      this.addTag(event.target.value.toLowerCase(), event);
    }
  }

  render() {
    const { 
      valuePath,
      value,
      onNewTagNameChange,
      onAddValidatedTag,
      onDeleteTag,
      validationState,
      validationMessages,
      label,
      isDirty,
      disabled,
      selectedTags,
      tagManager,
      hidden,
      ...other 
    } = this.props;

    const { hasValueAwaitingAddition } = this.state;
    const mergedIsDirty = isDirty || this.state.isDirty;
    const showValidationMessages = (mergedIsDirty && validationMessages && validationMessages.length > 0);

    return (
      <div className="o-tag-field">
        <FormGroup className="o-form-control o-form-control-tag-field">
          { !label ? null : <Label>{label}</Label>}
          
          {!hidden && (
            <Input type="text" 
              onChange={this.onNewTagTextChange} 
              onKeyPress={this.handleKeyPress} 
              invalid={(showValidationMessages || hasValueAwaitingAddition)} 
              disabled={disabled}
              {...other} />
          )}
      
          { showValidationMessages && (<ValidationMessages value={validationMessages} />) }

          { !showValidationMessages && 
            hasValueAwaitingAddition && 
            (<ValidationMessages value={['Press ENTER to add this tag.']} />)
          }
          {!hidden && (selectedTags.length > 0) && <span className="o-helpful-text"> Added tags: </span>}
          { selectedTags && selectedTags.map(tag => 
            (tag.id || tag.name) ?
              (<Tag tag={tag} key={`id{${tag.id}}:name{${tag.name}}`} onDelete={this.deleteTag} noLink hidden={hidden} />)
              : (<Tag id={tag} key={tag} onDelete={this.deleteTag} noLink hidden={hidden} />)
          )}
        </FormGroup>
      </div>
    )

  }
}

TagField.propTypes = {
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
  value:
    PropTypes.arrayOf(
      PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
        PropTypes.shape({
          id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
          name: PropTypes.string,
          isUserGenerated: PropTypes.bool
        })
      ])
    ),
  placeHolder: PropTypes.string,
  onNewTagNameChange: (props, propName, componentName, location) => {
    if(props.onNewTagNameChange === undefined && !props.valuePath) {
      return new Error(`One of props '${propName}' or 'valuePath' was not specified in ${componentName}.`);
    }

    const typeOfValue = typeof props.onNewTagNameChange;
    if(props.onNewTagNameChange && typeOfValue !== 'function') {
      return new Error(`Invalid ${location} '${propName}' of type '${typeOfValue}' supplied to '${componentName}', expected 'function'.`);
    }

    return undefined;
  },
  onAddValidatedTag: (props, propName, componentName, location) => {
    if(props.onAddValidatedTag === undefined && !props.valuePath) {
      return new Error(`One of props '${propName}' or 'valuePath' was not specified in ${componentName}.`);
    }

    const typeOfValue = typeof props.onAddValidatedTag;
    if(props.onAddValidatedTag && typeOfValue !== 'function') {
      return new Error(`Invalid ${location} '${propName}' of type '${typeOfValue}' supplied to '${componentName}', expected 'function'.`);
    }

    return undefined;
  },
  onDeleteTag: (props, propName, componentName, location) => {
    if(props.onDeleteTag === undefined && !props.valuePath) {
      return new Error(`One of props '${propName}' or 'valuePath' was not specified in ${componentName}.`);
    }

    const typeOfValue = typeof props.onDeleteTag;
    if(props.onDeleteTag && typeOfValue !== 'function') {
      return new Error(`Invalid ${location} '${propName}' of type '${typeOfValue}' supplied to '${componentName}', expected 'function'.`);
    }

    return undefined;
  },
  validationState: (props, propName, componentName, location) => {
    if(props.validationState === undefined && !props.valuePath) {
      return new Error(`One of props '${propName}' or 'valuePath' was not specified in ${componentName}.`);
    }

    const typeOfValue = typeof props.validationState;
    if(props.validationState && typeOfValue !== 'object') {
      return new Error(`Invalid ${location} '${propName}' of type '${typeOfValue}' supplied to '${componentName}', expected 'object'.`);
    }
    const validationProcessingState = get(props, 'validationState.validationProcessingState', null);
    const typeOfValidationProcessingState = typeof validationProcessingState;
    if(props.validationState && typeOfValidationProcessingState !== 'string') {
      return new Error(`Invalid ${location} '${propName}.validationProcessingState' of type '${typeOfValidationProcessingState}' supplied to '${componentName}', expected 'object'.`);
    }

    return undefined;
  },
  validationMessages: (props, propName, componentName, location) => {
    if(props.validationMessages === undefined && !props.valuePath) {
      return new Error(`One of props '${propName}' or 'valuePath' was not specified in ${componentName}.`);
    }
    
    const typeOfValue = typeof props.validationMessages;
    if(
      props.validationMessages && 
      (
        typeOfValue !== 'object' // Arrays have a prop type of 'object'
        || !(props.validationMessages.length >= 0) // Should have a length
      )
    ) {
      return new Error(`Invalid ${location} '${propName}' of type '${typeOfValue}' supplied to '${componentName}', expected 'array'.`);
    }

    return undefined;
  },
  label: PropTypes.string,
  isDirty: PropTypes.bool,
  disabled: PropTypes.bool,
  hidden: PropTypes.bool
};

const mapStateToProps = (state, props) => {
  const value = props.value || [];
  const selectedTags = [];
  
  
  value.forEach(t => {
    if(t.name) {
      selectedTags.push(t);
    } else {
      const tagId = t.id || t;
      const tag = state.tags[tagId];
      selectedTags.push(tag || tagId);
    }
  });

  return { selectedTags }
};

const ConnectedTagField = connect(mapStateToProps)(React.memo(TagField))
ConnectedTagField[internalFieldNames.COMPONENT_NAME] = 'TagField';

export default ConnectedTagField;
