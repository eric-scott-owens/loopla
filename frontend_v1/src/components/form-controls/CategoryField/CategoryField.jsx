import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormGroup, Label} from 'reactstrap';
import get from 'lodash/get';
import values from 'lodash/values';
import Select from 'react-select';

import { isNullOrWhitespace } from '../../../utilities/StringUtilities';
import { VALIDATION_PROCESSING_STATE as processingStates } from '../../../reducers/validation';
import Category from '../../Category';
import ValidationMessages from '../ValidationMessages';
import { internalFieldNames } from '../../AutoForm';

import "./CategoryField.scss";

/**
 * Array of options to populate the select list with. 
 * This will be populated once when it has been detected
 * that categories have been loaded (which happens once 
 * on load).
 */
let categorySelectOptions = [];

function tryPopulateCategorySelectOptions(categories) {
  if(categorySelectOptions.length === 0) {
    // Populate the categorySelectOptions , but only if we haven't already
    // This works because we load all the categories when the app loads.
    categorySelectOptions = 
      (values(categories)).map(category => ({ 
                                              value: category.id, 
                                              label: category.pathName
                                            }));

    categorySelectOptions.sort((a, b) => {
      if(a.label < b.label) return -1;
      if(a.label > b.label) return 1;
      return 0;
    });
  }
}


class CategoryField extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isDirty: !!props.isDirty,
      hasValueAwaitingAddition: false
    }
  }

  componentDidMount() {
    tryPopulateCategorySelectOptions(this.props.categories);
  }

  shouldComponentUpdate(nextProps) {
    tryPopulateCategorySelectOptions(nextProps.categories);
    return true;
  }

  onNewCategoryTextChange = (event) => {
    const { value } = event.target;
    this.props.onNewCategoryNameChange(value);
    this.setState({ isDirty: true, hasValueAwaitingAddition: !isNullOrWhitespace(value) });
  }
  
  setSelectReference = (node) => {
    this.select = node;
  }

  addCategory = (categoryId, event) => {
    const { validationState, validationMessages } = this.props;

    if (
      !validationState || 
      validationState.validationProcessingState !== processingStates.complete
    ) {
      // If validation isn't complete, come back later
      setTimeout(() => { this.addCategory(categoryId, event); }, 20);
      return;
    }

    const category = this.props.categories[categoryId];
    const { value } = this.props;
    const matchingCategories = value.filter(id => id === category.id);

    if(matchingCategories.length === 0 && validationMessages.length === 0) {
      this.props.onAddValidatedCategory(category);
      this.select.state.inputValue = '';
      this.select.state.menuIsOpen = false;
      this.setState({ isDirty: false, hasValueAwaitingAddition: false });
    }
  }

  handleAdd = (event) => {
    this.addCategory(event.value, event);
  }

  handleKeyPress = (event) => {
    if(event.key === "Enter") {
      event.preventDefault();
      this.addCategory(event.target.value.toLowerCase(), event);
    }
  }

  noOptionsMessage = () => null;



  deleteCategory = (category) => {
    this.props.onDeleteCategory(category);
  }

  render() {
    const { 
      valuePath,
      value,
      onNewCategoryNameChange,
      onAddValidatedCategory,
      onDeleteCategory,
      validationState,
      validationMessages,
      label,
      isDirty,
      disabled,
      onChange,
      ...other 
    } = this.props;

    const { hasValueAwaitingAddition } = this.state;
    const mergedIsDirty = isDirty || this.state.isDirty;
    const showValidationMessages = (mergedIsDirty && validationMessages && validationMessages.length > 0);

    return (
      <div className="o-category-field">
        <FormGroup className="o-form-control o-form-control-category-field">
          { !label ? null : <Label>{label}</Label>}
          
          <Select type="text"
            value={null}
            onChange={this.handleAdd}
            onKeyPress={this.handleKeyPress} 
            isDisabled={disabled}
            options={categorySelectOptions}
            placeholder="Categories"
            classNamePrefiex="react-select"
            noOptionsMessage={this.noOptionsMessage}
            ref={this.setSelectReference}
            isSearchable
            invalid={(showValidationMessages || hasValueAwaitingAddition)} 
            {...other} />
      
          { showValidationMessages && (<ValidationMessages value={validationMessages} />) }

          { !showValidationMessages && 
            hasValueAwaitingAddition && 
            (<ValidationMessages value={['Press ENTER to add this category.']} />)
          }
          {value && (
            <React.Fragment>
              {(value.length > 0) && (<span className="o-helpful-text"> Added categories: </span>)}

              {value.map(categoryId => 
                (<Category id={categoryId} key={categoryId} onDelete={this.deleteCategory} noLink />)
              )}
            </React.Fragment>
          )}
        </FormGroup>
      </div>
    )

  }
}

CategoryField.propTypes = {
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
  onNewCategoryNameChange: (props, propName, componentName, location) => {
    if(props.onNewCategoryNameChange === undefined && !props.valuePath) {
      return new Error(`One of props '${propName}' or 'valuePath' was not specified in ${componentName}.`);
    }

    const typeOfValue = typeof props.onNewCategoryNameChange;
    if(props.onNewCategoryNameChange && typeOfValue !== 'function') {
      return new Error(`Invalid ${location} '${propName}' of type '${typeOfValue}' supplied to '${componentName}', expected 'function'.`);
    }

    return undefined;
  },
  onAddValidatedCategory: (props, propName, componentName, location) => {
    if(props.onAddValidatedCategory === undefined && !props.valuePath) {
      return new Error(`One of props '${propName}' or 'valuePath' was not specified in ${componentName}.`);
    }

    const typeOfValue = typeof props.onAddValidatedCategory;
    if(props.onAddValidatedCategory && typeOfValue !== 'function') {
      return new Error(`Invalid ${location} '${propName}' of type '${typeOfValue}' supplied to '${componentName}', expected 'function'.`);
    }

    return undefined;
  },
  onDeleteCategory: (props, propName, componentName, location) => {
    if(props.onDeleteCategory === undefined && !props.valuePath) {
      return new Error(`One of props '${propName}' or 'valuePath' was not specified in ${componentName}.`);
    }

    const typeOfValue = typeof props.onDeleteCategory;
    if(props.onDeleteCategory && typeOfValue !== 'function') {
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
  disabled: PropTypes.bool
};

const mapStateToProps = (state) => {
  const { categories } = state;
  return { categories };
};

const ConnectedCategoryField = connect(mapStateToProps)(React.memo(CategoryField));
ConnectedCategoryField[internalFieldNames.COMPONENT_NAME] = 'CategoryField';
export default ConnectedCategoryField;
