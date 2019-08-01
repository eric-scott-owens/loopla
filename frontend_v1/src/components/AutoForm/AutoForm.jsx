import React from 'react';
import PropTypes from 'prop-types';
import { Form, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import get from 'lodash/get';
import forEach from 'lodash/forEach';
import cloneDeep from 'lodash/cloneDeep';
import keys from 'lodash/keys';
import debounce from 'lodash/debounce';
import set from 'lodash/set';

import { Prompt } from 'react-router';
import AutoFormToolbar from './AutoFormToolbar';
import BasicButton from '../BasicButton';
import ValidationState, { VALIDATION_PROCESSING_STATE as processingStates }  from './ValidationState';

export const internalFieldNames = {
  IS_EDITING: '__is_editing__',
  COMPONENT_NAME: '__component_name__'
};

export const RETRY_USER_UI_INTERACTION_COMMAND_DELAY = 200;
export const CHANGE_PUBLICATION_THROTTLE = 200;

/**
 * Dictionary of data models for forms. 
 * These values will be added based on the ID of the data model provided.
 * By default, these will be cleared when componentWillUnmount is run. However,
 * this functionality can be opted out of so that drafts can be and recalled.
 */
const formDataBackers = {};
const validationStates = {};

function initializeAutoForm(autoForm, props) {
  if (props.dontInitialize) { return; }

  if(
    !formDataBackers[props.data.id] // Happens if there is not an editing object backer to stage updates in yet
  ) {
    const editingObject = { ...cloneDeep(props.data), [internalFieldNames.IS_EDITING]: true };
    formDataBackers[editingObject.id] = editingObject;

    if(props.validator) {
      validationStates[editingObject.id] = new ValidationState();
      autoForm.validateForm();
    }
  }
};

const initialState = {
  resetForm: false,
  forceIsDirty: false,
  isProcessing: false,
  modalOnNavigateBack: false,
  changeCount: 0 // Used to trigger redraws - updated any time field values or validations change
};

export function getEditingObjectById(editingObjectId) {
  if(!formDataBackers[editingObjectId]) throw new Error('Invalid ID provided');
  return formDataBackers[editingObjectId];
}

// eslint-disable-next-line
/*************************************************
 ** WARNING: 
 **   RepeatingFormSection is tightly coupled to
 **   AutoForm. Changes here or there will likely
 **   required changes in the other.
 ************************************************/

class AutoForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {...initialState};

    this.validatorId = props.validator ? props.validator.getValidatorId() : undefined;

    // simple lock to keep the processing and cancel buttons from spamming prior to being disabled by the DOM
    // Used by this.onCancel and this.onProcess
    this.processingLock = false; 


    // Dictionary of locks that have been added by plugins. These locks indicate that 
    // if processing is triggered, it should be delayed pending work the plugin
    // is performing. Processing will continue to be attempted until all of these
    // locks have been removed. 
    // 
    // NOTE: The presence of a dictionary entry indicates a lock exists 
    this.delayProcessingLocks = {};

    // Dictionary of functions used to update specific field values in the auto form instance.
    // These are used to prevent spamming of prop type changes. A function will be created
    // only once per field and then will be reused until the AutoForm is destroyed.
    this.fieldValueUpdateHandlers = {};

    this.debouncedValidateForm = debounce(this.validateForm, CHANGE_PUBLICATION_THROTTLE);
    this.debouncedPublishChangeOccurred = debounce(this.publishChangeOccurred, CHANGE_PUBLICATION_THROTTLE)

    initializeAutoForm(this, this.props);

    // Pass reference to this AutoForm instance if requested
    if(this.props.autoFormInstance) {
      this.props.autoFormInstance(this);
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if(!this.state.resetForm && nextState.resetForm) {
      setTimeout(() => {
        this.setState({ resetForm: false });
      }, 10);
    }

    return true;
  }

  onResetForm = ({reinitializeForm}) => {
    setTimeout(() => {
      this.setState({ resetForm: true });
      
      if(reinitializeForm) {
        this.reinitializeForm();
      }
    }, 50);
  }

  onFieldValueUpdate = (fieldPath, fieldValue) => {
    const editingObject = this.getEditingObject();
    const updatedEditingObject = {...editingObject};
    set(updatedEditingObject, fieldPath, fieldValue);
    this.setEditingObject(updatedEditingObject);
    
    if(this.props.onFieldValueUpdateComplete) {
      this.props.onFieldValueUpdateComplete(fieldPath, fieldValue);
    }

    this.setState({
      modalOnNavigateBack: true
    })
  }

  

  onCancel = () => {
    // Abort button press spamming
    if(this.processingLock === true) return;
    
    this.processingLock = true;
    if(this.props.onCancel) {
      this.props.onCancel();
    }

    this.reinitializeForm();

    this.processingLock = false;
  }

  onCancelWithModal = () => {
    if(this.processingLock === true) return;

    this.processingLock = true;
    this.setState({
      isCancelModalVisible: true,
    });
    this.processingLock = false;
  }

  onProcess = async () => {
    // Abort button press spamming
    if(this.processingLock === true) return;

    this.processingLock = true;
    this.setState({isProcessing: true});
    
    // Make sure we don't have blockers preventing processing
    const canWeProcess = this.handleProcessingBlockersAndLocks();
    if(!canWeProcess) return;
    
    // Saving the post
    const editingObject = this.getEditingObject();
    const updatedEditingObject = { ...editingObject };
    const propsAtProcessing = cloneDeep(this.props);
    
    try {
      // Save and then redirect to the home loop
      const processingResult = await this.props.processingHandler(updatedEditingObject, propsAtProcessing);
  
      this.setState({forceIsDirty: false, isProcessing: false, modalOnNavigateBack: false });
  
      if(this.props.onProcessingComplete) {
        this.props.onProcessingComplete(updatedEditingObject, propsAtProcessing, processingResult);
      }
  
      if(!this.props.dontRemoveEditingObjectAfterSave) {
        // Remove editing data
        this.removeEditingObject();
        this.removeValidationState();
  
        if(this.props.onRemoveEditingObjectComplete) {
          this.props.onRemoveEditingObjectComplete(updatedEditingObject, propsAtProcessing, processingResult);
        }
      }

      if(this.props.resetEditingObjectAfterProcessing) {
        this.onResetForm({reinitializeForm: true});
      }
    }
    catch(error) {
      this.setState({isProcessing: false});
      if(this.props.onProcessingFailure) {
        this.props.onProcessingFailure(error, updatedEditingObject, propsAtProcessing);
      }
    }

    this.processingLock = false;
  }

  onProcessSubmit = (event) => {
    event.preventDefault();
    if (this.props.preventEnterKeyProcess) {
      return;
    }
    this.onProcess();
  }

  onDeleteRow = (arrayFieldPath, itemIndex) => {
    const editingObject = this.getEditingObject();
    const updatedEditingObject = { ...editingObject };
    const arrayProperty = get(editingObject, arrayFieldPath);
    
    if(!Array.isArray(arrayProperty)) {
      throw new Error('The property path does not identify an Array property');
    } else {
      const updatedArrayProperty = arrayProperty.slice(0);
      updatedArrayProperty.splice(itemIndex, 1);
      set(updatedEditingObject, arrayFieldPath, updatedArrayProperty)
    }

    this.setEditingObject(updatedEditingObject);
  }

  onAddRow = (arrayFieldPath, newRowValueProvider) => {
    const editingObject = this.getEditingObject();
    const updatedEditingObject = {...editingObject};
    const value = newRowValueProvider(editingObject);
    const arrayProperty = get(editingObject, arrayFieldPath);
    
    if(!Array.isArray(arrayProperty)) {
      throw new Error('The property path does not identify an Array property');
    } else {
      const updatedArrayProperty = arrayProperty.slice(0);
      updatedArrayProperty.push(value);
      set(updatedEditingObject, arrayFieldPath, updatedArrayProperty);
    }

    this.setEditingObject(updatedEditingObject);
  }

  getFieldValueUpdateHandler = (fieldPath, props) => {
    if(!this.fieldValueUpdateHandlers[fieldPath]) {
      this.fieldValueUpdateHandlers[fieldPath] = (fieldValue) => { 
        this.onFieldValueUpdate(fieldPath, fieldValue)
        // make sure anything passed gets handled

        if(props.onChange) {
          props.onChange(fieldValue);
        }
      };
    }

    return this.fieldValueUpdateHandlers[fieldPath];
  }

  /** Recursively clones children of the AutoForm with properties 
   *  automatically mapped to the backing EditingObject instance 
   *  based on props.valuePath being present on descendant nodes
   *  @name getPreparedChildren
   *  @function
   * 
   *  @param {Array(React.element)} Children 
   *    The children to be recursively wired up for use in the form
   * 
   *  @param {String} basePath 
   *    the accessor path to be used to get from the editing object
   *    to a nested property. This value should not be provided by the 
   *    initial caller. It is used in the recursion to build up the 
   *    nested path.
   */
  getPreparedChildren = (children, basePath) => {
    const autoFormInstance = this;
    const { forceIsDirty, changeCount } = this.state;
    const validationState = this.getValidationState();
    const editingObject = this.getEditingObject();
    const prepareChildrenPlugins = this.props.prepareChildrenPlugins || [];
    const currentChildren = children || this.props.children; // auto start recursion
    const currentBasePath = basePath || '';

    const preparedChildren = React.Children.map(currentChildren, child => {
      if(child) {
        const { props } = child;
        if(props) {

          // Map elements connected to the editing object via a valuePath
          if(props.valuePath) {
            // Handle form fields
            const fieldPath = currentBasePath + props.valuePath;
            const value = get(editingObject, fieldPath);
            const componentName = child.type[internalFieldNames.COMPONENT_NAME] || 'nameless-component';
            let updatedChild = child;

            // If we've hit a RepeatingFormSection,
            // Process the child elements within a repeater
            if(componentName === 'RepeatingFormSection') {
              // Wire up repeater handling
              const additionalProps = {
                value,
                onDeleteRow: this.onDeleteRow,
                onAddRow: this.onAddRow,
                changeCount
              };

              // Handle children
              if(
                value && value.length > 0 // Nothing to show if our value array is empty
                && props.children // Nothing to so if we have nothing in our repeating form section
              ) {

                // recursively prepare grandChildren
                // Setup repeating here :)
                const preparedGrandChildren = value.map((indexValue, index) => {
                  const newBasePath = `${fieldPath}[${index}]`;
                  return this.getPreparedChildren(props.children, newBasePath);
                });

                additionalProps.children = preparedGrandChildren;
              }
              
              // Return this object with remapped children
              return React.cloneElement(child, additionalProps);
            }
              
            // Build out the additional properties to add to the child
            let additionalProps = {
              valuePath: fieldPath,
              value,
              onChange: autoFormInstance.getFieldValueUpdateHandler(fieldPath, props),
              isDirty: (forceIsDirty || props.isDirty),
              changeCount,
              validationState,
              validationMessages: (
                validationState 
                && validationState.validationResult 
                && validationState.validationResult[fieldPath]
              ) ? validationState.validationResult[fieldPath] : []
            };
            
            // HACK - get rid of any needless prop type warnings
            if (
              additionalProps.value === undefined
              && (
                componentName === 'TextField' 
                || componentName === 'TextArea' 
              )
            ) { 
              additionalProps.value = '';
            }
    
            // Run plugins
            forEach(prepareChildrenPlugins, plugin => {
              const result = plugin.tryApplyPluginToReactElement(autoFormInstance, updatedChild, componentName, editingObject, props, additionalProps); 
              if(result.wasPluginApplied) {
                if(result.didPluginUpdateAdditionalProps) { 
                  additionalProps = result.updatedAdditionalProps;
                }

                if(result.didPluginRenderClone) {
                  updatedChild = result.clonedElement;
                }
              }
            });


            // Clone the child with the added properties added
            return React.cloneElement(updatedChild, additionalProps);
          }

          // Map elements connected to the form actions
          if(props.isAutoFormCancelButton) {
            const additionalProps = {
              onClick: this.getOnCancelHandler(),
              disabled: this.state.isProcessing,
              className: props.className || this.props.cancelButtonClassName,
              children: props.children || this.getCancelButtonText()
            };
            
            return React.cloneElement(child, additionalProps);
          }
          
          if(props.isAutoFormProcessButton) {
            const additionalProps = {
              onClick: this.onProcessSubmit,
              disabled: this.state.isProcessing,
              className: props.className || this.props.processingButtonClassName,
              children: props.children || this.getProcessingButtonText(),
              showValidationMessages: props.showValidationMessages !== undefined ? props.showValidationMessages : (this.state.forceIsDirty && !this.isFormValid())
            };

            return React.cloneElement(child, additionalProps);
          }

          // If not a form field, or a special RepeatingFormSection 
          // element, handle children recursively
          const grandChildren = props.children;
          if (grandChildren) {
            // recursively prepare grandChildren
            const preparedGrandChildren = this.getPreparedChildren(grandChildren, currentBasePath);
            return React.cloneElement(child, { children: preparedGrandChildren });
          }
        }
      }

      // Can't change this thing... 
      return child;
    });
    
    if(preparedChildren && preparedChildren.length === 1) {
      return preparedChildren[0];
    }

    return preparedChildren;
  }

  getProcessingButtonText = () => {
    if(this.props.processingButtonText) {
      if(typeof this.props.processingButtonText === 'function') {
        const editingObject = this.getEditingObject();
        if(!editingObject) return ''; // In the middle of resetting the form
        return this.props.processingButtonText(editingObject, this.props, this.state.isProcessing);
      }

      return this.props.processingButtonText;
    }

    return this.state.isProcessing ? 'Submitting...' : 'Submit';
  }

  getCancelButtonText = () => {
    if(this.props.cancelButtonText) {
      if(typeof this.props.cancelButtonText === 'function') {
        const editingObject = this.getEditingObject();
        if(!editingObject) return ''; // Inbetween resets
        return this.props.cancelButtonText(editingObject, this.props, this.state.isProcessing);
      }

      return this.props.cancelButtonText;
    }

    return 'Cancel';
  }

  getOnCancelHandler = () => {
    const { confirmCancel, onCancel } = this.props;
    if (!onCancel) return undefined; // Don't provide a handler. None was asked for... no need to show the button
    if (confirmCancel && this.state.modalOnNavigateBack) return this.onCancelWithModal;
    return this.onCancel;
  }

  getEditingObject = () => formDataBackers[this.props.data.id];

  setEditingObject = (value) => { 
    // Only set if a data backer has been initialized
    if(formDataBackers[this.props.data.id]) {
      formDataBackers[this.props.data.id] = value;
      this.debouncedPublishChangeOccurred();
      this.debouncedValidateForm();
    }
  }

  getValidationState = () => validationStates[this.props.data.id];

  setValidationState = (value) => { 
    // Only set if a data backer has been initialized
    if(validationStates[this.props.data.id]) {
      validationStates[this.props.data.id] = value;
      this.debouncedPublishChangeOccurred();
    }
  }

  removeEditingObject = () => { delete formDataBackers[this.props.data.id]; }
  
  removeValidationState = () => { delete validationStates[this.props.data.id]; }

  /**
   * With handle scenarios that block processing and then indicate whether or not 
   * processing can be completed
   * 
   * @returns {bool} - True if processing should be completed, else false
   */
  handleProcessingBlockersAndLocks = () => {
    // Check validation blocks to saving updates
    const validationState = this.getValidationState();

    if(
      validationState && 
      validationState.validationProcessingState !== processingStates.complete
    ) { 
      this.retryProcessingAfterDelay();
      return false;
    }

    if(
      validationState 
      && validationState.validationProcessingState === processingStates.complete
      && validationState.validationResult
      && validationState.validationResult.validatorId !== this.validatorId
    ) {
      this.debouncedValidateForm();
      this.retryProcessingAfterDelay();
      return false;
    }

    // If the form isn't valid, 
    // force validations to show and abort saving
    const isFormValid = validationState ? get(validationState, 'validationResult.isValid', false) : true;
    const isCustomValidationValid = this.props.isValid ? this.props.isValid() : true;

    if(!isFormValid || !isCustomValidationValid) {
      this.debouncedValidateForm();
      this.setState({forceIsDirty: true, isProcessing: false});
      this.processingLock = false;
      return false;
    }

    // Validation not a problem. Check plugin delayProcessingBlocks
    const delayLocks = keys(this.delayProcessingLocks);
    if(delayLocks.length > 0) {
      this.retryProcessingAfterDelay();
      return false;
    }

    // Nothing blocks completion of processing.
    return true;
  }

  publishChangeOccurred = () => {
    this.setState((state) => ({ changeCount: state.changeCount + 1 }));
  }

  publishValidationResult = (newValidationState) =>  {
    const oldValidationState = this.getValidationState();
    if (
      oldValidationState.validationProcessingState !== newValidationState.validationProcessingState
      || oldValidationState.validationResult !== newValidationState.validationResult
      || oldValidationState.error !== newValidationState.error
    ) {
      this.setValidationState(newValidationState);
    }
  }

  validateForm = async () => {
    const { validator } = this.props;
    if(validator) {
      const formData = this.getEditingObject();
      const validationState = this.getValidationState();
      const newValidationState = {...validationState};
      
      // Mark the validation as pending
      newValidationState.validationProcessingState = processingStates.pending;

      // Setup publication of the processing state every periodically
      const intervalId = setInterval(() => { this.publishValidationResult(newValidationState); }, CHANGE_PUBLICATION_THROTTLE);
  
      // Try to run the requested validator
      try {
        const validationResult = await validator.validate(formData);
        newValidationState.validationProcessingState = processingStates.complete;
        newValidationState.validationResult = validationResult;
      }
      catch(error) {
        newValidationState.validationProcessingState = processingStates.error
        newValidationState.error = error;
      }
      
      // Stop continuously updating the validation state and published the completed state
      clearInterval(intervalId);
      this.publishValidationResult(newValidationState);
      return newValidationState;
    }

    return undefined;
  }

  toggleCancelModal = () => {
    this.setState(prevState => ({
      isCancelModalVisible: !prevState.isCancelModalVisible,
    }));
  }

  addDelayProcessingLock = (lockId) => {
    if(this.delayProcessingLocks[lockId] !== undefined) { 
      throw new Error('CRITICAL: Duplicate delayProcessingLock assigned');
    }

    this.delayProcessingLocks[lockId] = true;
  }

  removeDelayProcessingLock = (lockId) => {
    delete this.delayProcessingLocks[lockId];
  }

  /**
   * Will restart attempts to process the form after the configured delay
   */
  retryProcessingAfterDelay = () => {
    const autoFormInstance = this;

    setTimeout(() => {
      autoFormInstance.processingLock = false; // Unlock the ability to trigger processing again 
      this.onProcess(); // Process
    }, RETRY_USER_UI_INTERACTION_COMMAND_DELAY);
  }

  isFormValid = () => {
    const validationState = this.getValidationState();
    const isFormValid = validationState ? get(validationState, 'validationResult.isValid', false) : true;

    return isFormValid;
  }

  reinitializeForm = () => {
    this.removeEditingObject();
    this.removeValidationState();
    initializeAutoForm(this, this.props);
    this.setState({...initialState});
  }

  render() {
    const { className, hideToolbar, toolbarClassName, processingButtonClassName, cancelButtonClassName, toolbarAlign, confirmCancel } = this.props;
    const { isProcessing, forceIsDirty } = this.state;
    const editingObject = this.getEditingObject();
    const processingButtonText = this.getProcessingButtonText();
    const cancelButtonText = this.getCancelButtonText();
    const isFormValid = this.isFormValid();

    if(!editingObject || !editingObject.id || this.state.resetForm) return null;

    const preparedChildren = this.getPreparedChildren();
    return (

      <Form className={className} onSubmit={this.onProcessSubmit}>
        {preparedChildren}
        
        {!hideToolbar && (
          <AutoFormToolbar
            isProcessing={isProcessing}
            className={toolbarClassName}
            align={toolbarAlign}
            showValidationMessages={forceIsDirty && !isFormValid}
            onCancel={this.getOnCancelHandler()}
            cancelButtonClassName={cancelButtonClassName}
            cancelButtonText={cancelButtonText}
            onProcess={this.onProcess}
            processingButtonClassName={processingButtonClassName}
            processingButtonText={processingButtonText} />
        )}

        <Modal isOpen={this.state.isCancelModalVisible} toggle={this.toggleCancelModal} className={this.props.className}>
          <ModalHeader toggle={this.toggleCancelModal}>Are you sure?</ModalHeader>
          <ModalBody className="text-center">
            Your unsaved changes will be lost. 
          </ModalBody>
          <ModalFooter>
            <BasicButton color="secondary" onClick={this.toggleCancelModal}>Nevermind</BasicButton>
            <BasicButton onClick={this.onCancel}>{'Yes, I\'m Sure'}</BasicButton> 
          </ModalFooter>
        </Modal>

        { confirmCancel && <Prompt when={this.state.modalOnNavigateBack} message="Are you sure? Your unsaved work will be lost." /> }

      </Form>
    );
  }
}

AutoForm.propTypes = {

  // *************** Data Configuration ******************************

  // eslint-disable-next-line
  data: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    model: PropTypes.string.isRequired
  }).isRequired,

  // eslint-disable-next-line
  validator: PropTypes.shape({
    startFieldValidators: PropTypes.func.isRequired
  }),
  
  /**
   * Defines plugins used to extend the functionality of
   * AutoForm.getPreparedChildren().
   */
  prepareChildrenPlugins: PropTypes.arrayOf(PropTypes.shape({
    tryApplyPluginToReactElement: PropTypes.func.isRequired
  })),

  /**
   * Provides a reference to the AutoForm instance to the parent context
   * if a function is provided to pass it to;
   * 
   * Example: 
   *  <AutoForm
   *    ...
   *    autoFormInstance={(autoFormInstance) => { this.autoFromInstance = autoFormInstance; }}> ... </AutoForm>
   */
  autoFormInstance: PropTypes.func,

  // *************** Life Cycle Hooks ********************************

  /**
   * This function is called when the cancel button is pressed. The presence of
   * this button also determines whether or not the cancel button will be 
   * displayed.
   * 
   * @example
   *    onCancel={() =>{
   *      // handle cancellation
   *    }}
   */
  onCancel: PropTypes.func,

  /**
   * This function is called every time and update has been triggered to one of
   * the field values tracked by AutoForm.
   * 
   * The field path and the field value with which onFieldValueUpdate were 
   * triggered will be passed to this function
   * 
   * @example
   *    onFieldValueUpdateComplete={(fieldPath, fieldValue) => { 
   *      // do something
   *    }}
   */
  onFieldValueUpdateComplete: PropTypes.func,

  /** 
   *  This function is called when the process action has been triggered and has
   *  not been blocked by validation errors. 
   * 
   *  The editingObject and properties present at the time processing
   *  began will be passed to this function as arguments.
   * 
   *  @example
   *    processingHandler={(editingObject, props) => {
   *       // do something
   *    }}
   */ 
  processingHandler: PropTypes.func.isRequired,

  /**
   *  This function is called when processing has completed and cleanup is complete
   *  except for removing the backing editing object
   * 
   *  The editingObject, properties present at the time processing
   *  began, and any result returned from the processing handler will 
   *  be passed to this function as arguments.
   * 
   *  @example
   *    onProcessingComplete={(editingObject, props, processingResult) => {
   *      // do something
   *    }}
   */
  onProcessingComplete: PropTypes.func,


  /**
   *  This function is called when processing has failed
   * 
   *  The error, editingObject, and properties present at the time processing
   *  began will be passed to this function as arguments.
   * 
   *  @example
   *    onProcessingFailure={(error, updatedEditingObject, propsAtProcessing) => {
   *      // do something
   *    }}
   */
  onProcessingFailure: PropTypes.func,
 
  /**
   * Flags the processing workflow to not remove the backing editing object
   * after processing has been completed.
   */
  dontRemoveEditingObjectAfterSave: PropTypes.bool,

  /**
   * Flags the processing workflow to reset the form to its original state
   * after processing has been completed.
   */
  resetEditingObjectAfterProcessing: PropTypes.bool,

  /**
   *  This function is called when the backing editing object has been removed from
   *  the store.
   * 
   *  The editingObject, properties present at the time processing
   *  began, and any result returned from the processing handler will 
   *  be passed to this function as arguments.
   * 
   *  @example
   *    onRemoveEditingObjectComplete={(editingObject, props, processingResult) => {
   *      // do something
   *    }}
   */
  onRemoveEditingObjectComplete: PropTypes.func,
  

  // *************** Display Configuration ***************************

  /**
   *  Defines the form elements in scope for AutoForm to handle data binding
   */
  children: PropTypes.oneOfType([
    PropTypes.element, 
    PropTypes.string, 
    PropTypes.bool,
    PropTypes.arrayOf(PropTypes.oneOfType([ PropTypes.element, PropTypes.string, PropTypes.bool ]))
  ]).isRequired,

  /**
   * Class name(s) to add to the form which acts as a container
   * for the AutoForm and its children.
   */
  className: PropTypes.string,

  /**
   * If true, the bottom toolbar and it's contents will be hidden.
   */
  hideToolbar: PropTypes.bool,

  /**
   * Aligns the contents of the toolbar 
   */ 
  toolbarAlign: PropTypes.oneOf(['right', 'left', 'center']),

  /**
   * Adds the specified CSS class(es) to the toolbar
   */
  toolbarClassName: PropTypes.string,

  /**
   * Adds the specified CSS class(es) to the processing button
   */
  processingButtonClassName: PropTypes.string,

  /**
   *  Specifies the text to display on the processing button.
   * 
   *  This can be either a string or a function. 
   * 
   *  If a function is provided, The current editingObject, properties, and
   *  a boolean indicating whether or not the form is currently processing 
   *  will be passed to this function as arguments.
   * 
   * @example 1
   *    processingButtonText="Save"
   *    
   * @example 2
   *    processingButtonText={(editingObject, props, isProcessing) => {
   *      // return the string to display in the processing button
   *    }}
   */
  processingButtonText: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),

  /**
   * Adds the specified CSS class(es) to the cancel button
   */
  cancelButtonClassName: PropTypes.string,

  /**
   *  Specifies the text to display on the cancel button.
   * 
   *  This can be either a string or a function. 
   * 
   *  If a function is provided, The current editingObject, properties, and
   *  a boolean indicating whether or not the form is currently processing 
   *  will be passed to this function as arguments.
   * 
   *  NOTE: 
   *    if no onCancel function is provided the cancel button will not
   *    be displayed
   * 
   * @example 1
   *    processingButtonText="Cancel"
   *    
   * @example 2
   *    processingButtonText={(editingObject, props, isProcessing) => {
   *      // return the string to display in the cancel button
   *    }}
   */
  cancelButtonText: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),

  /** 
   *  Controls whether or not the AutoForm will block the Enter button from triggering onProcess
   */

  preventEnterKeyProcess: PropTypes.bool, 

  /** 
   *  Controls whether or not the AutoForm will show a modal when canceling to confirm the cancel action
   */
  confirmCancel: PropTypes.bool, 

  /** 
   *  Controls whether or not the AutoForm will trigger initializeAutoForm
   *  Used when canceling a form to ensure that an editingObject is not made after the cancel action
   *  
   */
  // eslint-disable-next-line react/no-unused-prop-types
  dontInitialize: PropTypes.bool
  
};

export default AutoForm;
