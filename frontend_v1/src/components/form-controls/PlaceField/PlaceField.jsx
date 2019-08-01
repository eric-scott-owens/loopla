import React from 'react';
import PropTypes from 'prop-types';
import Autocomplete from 'react-google-autocomplete';
import get from 'lodash/get';
import { FormGroup, Label } from 'reactstrap';
import { connect } from 'react-redux';

import configuration from '../../../configuration';
import { fromServerGooglePlaceObject } from '../../../containers/places/googlePlaces/mappers';
import { getBlankModelFor } from '../../../utilities/ObjectUtilities';
import { isNullOrWhitespace } from '../../../utilities/StringUtilities';
import { VALIDATION_PROCESSING_STATE as processingStates } from '../../../reducers/validation';
import * as googlePlaceActions from '../../../containers/places/googlePlaces/actions';
import Place from '../../Place';
import ValidationMessages from '../ValidationMessages';
import { internalFieldNames, RETRY_USER_UI_INTERACTION_COMMAND_DELAY } from '../../AutoForm';


 class PlaceField extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isDirty: !!props.isDirty,
      hasValueAwaitingAddition: false
    }

    this.autocomplete = React.createRef();
  }

  onNewPlaceTextChange = (event) => {
    const { value } = event.target;
    this.props.onNewPlaceNameChange(value);
    this.setState({ isDirty: true, hasValueAwaitingAddition: !isNullOrWhitespace(value)  });
  }

  handlePlaceSelection = (place) => {
    this.addPlace(place);
  }

  
  deletePlace = (place) => {
    this.props.onDeletePlace(place);
  }

  addPlace(place) {
    const { validationState, validationMessages } = this.props;

    if (
      !validationState ||
      validationState.validationProcessingState !== processingStates.complete
    ) {
      // If validation isn't complete, come back later
      setTimeout(() => { this.addPlace(place); }, RETRY_USER_UI_INTERACTION_COMMAND_DELAY);
      return;
    }
    
    const googlePlace = place.place_id ? fromServerGooglePlaceObject(place) : null;
    const newPlace = getBlankModelFor(configuration.MODEL_TYPES.place);
    newPlace.name = googlePlace? null : place.name;
    newPlace.googlePlaceId = googlePlace? googlePlace.id: null;
    newPlace.isUserGenerated = !googlePlace;

    const { selectedPlaces } = this.props;
    const matchingPlaces = selectedPlaces.filter(p => 
      p.name === newPlace.name && p.googlePlaceId === newPlace.googlePlaceId
    );

    if(
      !isNullOrWhitespace(place.name) &&
      matchingPlaces.length === 0 &&
      (validationMessages.length === 0)
    ) {

      if(this.props.onWillAddValidatedPlace) {
        this.props.onWillAddValidatedPlace(newPlace);
      }

      // Make sure the google place is added to the store
      if(googlePlace) {
        this.props.dispatchSetGooglePlace(googlePlace);
      }

      // Add the place and reset the isDirty flag
      this.props.onAddValidatedPlace(newPlace);
      this.autocomplete.current.refs.input.value = "";
      this.setState({ isDirty: false, hasValueAwaitingAddition: false });

      if(this.props.onDidAddValidatedPlace) {
          this.props.onDidAddValidatedPlace(newPlace);
      }
    }
  }

   render() {
    const {
      valuePath,
      value,
      className,
      onNewPlaceNameChange,
      onWillAddValidatedPlace,
      onAddValidatedPlace,
      onDidAddValidatedPlace,
      onDeletePlace,
      validationState,
      validationMessages,
      label,
      isDirty,
      disabled,
      selectedPlaces,
      dispatchSetGooglePlace,
      changeCount,
      ...other
    } = this.props;

    const { hasValueAwaitingAddition } = this.state;
    const mergedIsDirty = isDirty || this.state.isDirty;
    const showValidationMessages = (mergedIsDirty && validationMessages && validationMessages.length > 0);

    return (
      <div className="o-place-field">
        <FormGroup className="o-form-control o-form-control-place-field">
          { !label ? null : <Label>{label}</Label>}

          <Autocomplete 
            ref={this.autocomplete}
            className={`form-control ${(showValidationMessages || hasValueAwaitingAddition) ? 'is-invalid' : ''} ${className}`}
            onChange={this.onNewPlaceTextChange}
            onPlaceSelected={(place) => this.handlePlaceSelection(place)}
            types={['geocode', 'establishment']}
            {...other} />

          { showValidationMessages && (<ValidationMessages value={validationMessages} />) }

          { !showValidationMessages && 
            hasValueAwaitingAddition && 
            (<ValidationMessages value={['Press ENTER to add this place.']} />)
          }

          { selectedPlaces && selectedPlaces.map(place =>
            (
              <Place 
                place={place} 
                key={place.name || place.googlePlaceId} 
                onDelete={() => this.deletePlace(place) } 
                noLink
                noMap />
            )
          )}
        </FormGroup>
      </div>
    )

  }
}

PlaceField.propTypes = {
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
  onNewPlaceNameChange: (props, propName, componentName, location) => {
    if(props.onNewPlaceNameChange === undefined && !props.valuePath) {
      return new Error(`One of props '${propName}' or 'valuePath' was not specified in ${componentName}.`);
    }

    const typeOfValue = typeof props.onNewPlaceNameChange;
    if(props.onNewPlaceNameChange && typeOfValue !== 'function') {
      return new Error(`Invalid ${location} '${propName}' of type '${typeOfValue}' supplied to '${componentName}', expected 'function'.`);
    }

    return undefined;
  },
  onWillAddValidatedPlace: PropTypes.func,
  onAddValidatedPlace: (props, propName, componentName, location) => {
    if(props.onAddValidatedPlace === undefined && !props.valuePath) {
      return new Error(`One of props '${propName}' or 'valuePath' was not specified in ${componentName}.`);
    }

    const typeOfValue = typeof props.onAddValidatedPlace;
    if(props.onAddValidatedPlace && typeOfValue !== 'function') {
      return new Error(`Invalid ${location} '${propName}' of type '${typeOfValue}' supplied to '${componentName}', expected 'function'.`);
    }

    return undefined;
  },
  onDidAddValidatedPlace: PropTypes.func,
  onDeletePlace: (props, propName, componentName, location) => {
    if(props.onDeletePlace === undefined && !props.valuePath) {
      return new Error(`One of props '${propName}' or 'valuePath' was not specified in ${componentName}.`);
    }

    const typeOfValue = typeof props.onDeletePlace;
    if(props.onDeletePlace && typeOfValue !== 'function') {
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
}

const mapStateToProps = (state, props) => {
  const value = props.value || [];
  const selectedPlaces = [];

  value.forEach(p => {
    // Gather full bodied places used by this field
    const place = (p.name || p.googlePlaceId) ? p : state.places[p];
    selectedPlaces.push(place);
  });

  return { selectedPlaces };
}

const mapDispatchToProps = dispatch => ({
  dispatchSetGooglePlace: (googlePlace) => dispatch(googlePlaceActions.set(googlePlace))
});

const ConnectedPlaceField = connect(mapStateToProps, mapDispatchToProps)(PlaceField);
ConnectedPlaceField[internalFieldNames.COMPONENT_NAME] = 'PlaceField';
export default ConnectedPlaceField;
