import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import debounce from 'lodash/debounce';
import { FormGroup, Label} from 'reactstrap';

import { getPlainTextForSlateValue, getDefaultSlateValue } from './SerializerUtilities';
import SlateEditor from './SlateEditor';
import ValidationMessages from '../ValidationMessages';
import { searchUsers } from '../../../containers/users/actions';
import { fromServerUserDisplayObject } from '../../../containers/users/mappers';
import { internalFieldNames } from '../../AutoForm';

import "./RichTextField.scss";

class RichTextField extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isDirty: !!props.isDirty,
      isFocused: false
    };
    
    /**
     * Used as a stable default to keep SlateEditor from needlessly
     * re-rendering
     */
    this.defaultValue = getDefaultSlateValue();

    /**
     * Is used to capture instantaneous changes to the focus of the RichTextField.
     * This will flip back and forth quickly when focus shifts from one child element
     * to another. This is combined with debouncing to prevent needless changes 
     * propagating to this.state.isFocused
     */
    this.isFocusedChaos = false;
    this.debouncedUpdateIsFocusedState = debounce(this.updateIsFocusedState, 300);
  }

  onChange = ({value}) => {
    if(!this.props.disabled) {
      if(getPlainTextForSlateValue(value).length > 0) {
        this.setState({ isDirty: true });
      }
      
      this.props.onChange(value);
    }
  }

  onKeyDown = (event, editor, next) => {
    let returnValue;
    if(this.props.onKeyDown) {
      returnValue = this.props.onKeyDown(event, editor, next);
    }

    // Need to return something to SlateEditor so it can decide whether or not
    // to return next()
    return returnValue;
  }

  onFocus = (event, editor, next) => {
    let returnValue;
    if(this.props.onFocus) {
      returnValue = this.props.onFocus(event, editor, next);
    }

    this.isFocusedChaos = true;
    this.debouncedUpdateIsFocusedState();

    // Need to return something to SlateEditor so it can decide whether or not
    // to return next()
    return returnValue;
  }

  onBlur = (event, editor, next) => {
    let returnValue;
    if(this.props.onBlur) {
      returnValue = this.props.onBlur(event, editor, next);
    }

    this.isFocusedChaos = false;
    this.debouncedUpdateIsFocusedState();

    // Need to return something to SlateEditor so it can decide whether or not
    // to return next()
    return returnValue;
  }

  onToolbarButtonClick = (event, editor, next) => {
    let returnValue;
    if(this.props.onToolbarButtonClick) {
      returnValue = this.props.onToolbarButtonClick(event, editor, next);
    }

    setTimeout(() => {
      this.isFocusedChaos = true;
      this.debouncedUpdateIsFocusedState();
    }, 10);

    // Need to return something to SlateEditor so it can decide whether or not
    // to return next()
    return returnValue;
  }

  updateIsFocusedState = () => {
    if(this.state.isFocused !== this.isFocusedChaos) {
      this.setState({ isFocused: this.isFocusedChaos });
    }
  }

  searchMentionedUserMatches = async (query) => {
    const userMatches = await this.props.dispatchSearchUsers(query);
    return (userMatches || []).map(u => {
      const mappedUser = fromServerUserDisplayObject(u);
      return {
        id: mappedUser.id,
        text: `${mappedUser.firstName} ${mappedUser.lastName}`,
        description: `${mappedUser.firstName} ${mappedUser.lastName} (${mappedUser.email})`
      }
    });
  }

  render() {
    const { disabled, label, value, validationMessages, isDirty, className, placeholder } = this.props
    const mergedIsDirty = isDirty || this.state.isDirty;
    const showValidationMessages = (mergedIsDirty && validationMessages && validationMessages.length > 0);
    const { isFocused } = this.state;

    return (
      <FormGroup 
        className={`o-form-control o-form-control-rich-text-field ${className || ''}${disabled ? ' disabled' : ''}${isFocused ? ' is-focused' : ''}`}>
        { !label ? null : <Label>{label}</Label>}

        <SlateEditor 
          value={value || this.defaultValue}
          disabled={disabled}
          readOnly={disabled}
          placeholder={placeholder}
          onChange={this.onChange} 
          onKeyDown={this.onKeyDown}
          onFocus={this.onFocus}
          onBlur={this.onBlur}
          onToolbarButtonClick={this.onToolbarButtonClick}
          onToolbarClick={this.onToolbarButtonClick} // Don't need anything different here, not exposing to the outside
          searchPeopleAsync={this.searchMentionedUserMatches}
          />

        {showValidationMessages && ( <ValidationMessages value={validationMessages} /> )}

      </FormGroup>
    );
  }

}

RichTextField[internalFieldNames.COMPONENT_NAME] = 'RichTextField';

RichTextField.propTypes = {
  label: PropTypes.string,
  disabled: PropTypes.bool,
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
    if(props.value && typeOfValue !== 'object') {
      return new Error(`Invalid ${location} '${propName}' of type '${typeOfValue}' supplied to '${componentName}', expected 'slatejs::Value'.`);
    }

    return undefined;
  },
  onChange:  (props, propName, componentName, location) => {
    if(props.disabled) return undefined;

    if(props.onChange === undefined && !props.valuePath) {
      return new Error(`One of props '${propName}' or 'valuePath' was not specified in ${componentName}.`);
    }

    const typeOfValue = typeof props.onChange;
    if(props.value && typeOfValue !== 'function') {
      return new Error(`Invalid ${location} '${propName}' of type '${typeOfValue}' supplied to '${componentName}', expected 'function'.`);
    }

    return undefined;
  },
  onKeyDown: PropTypes.func,
  onBlur: PropTypes.func,
  onFocus: PropTypes.func,
  onToolbarButtonClick: PropTypes.func,
  validationMessages: PropTypes.arrayOf(PropTypes.string)
}

const mapDispatchToProps = (dispatch) => ({
  dispatchSearchUsers: (query) => dispatch(searchUsers(query))
});

export default connect(null, mapDispatchToProps)(RichTextField);