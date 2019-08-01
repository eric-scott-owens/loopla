import React from 'react';
import PropTypes from 'prop-types';
import DropZone from 'react-dropzone';
import Edit from '@material-ui/icons/Edit';
import { FormGroup, Label, FormFeedback } from 'reactstrap';

import IconButton from '../../IconButton';
import { internalFieldNames } from '../../AutoForm';

import './ProfilePhotoUploader.scss';

class PhotoUploader extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rejectedFiles: []
    }
  }

  /**
   * Handles files being added to the photo gallery builder
   */
  onDrop = (acceptFiles, rejectedFiles) => {
    if(acceptFiles.length === 1) {
      this.props.onChange(acceptFiles[0]);
      this.setState((state) => state.rejectedFiles.length === 0 ? state : { rejectedFiles: [] });
    }

    if(rejectedFiles.length > 0) {
      this.setState({ rejectedFiles });
    }
    

    this.onFilesSelected();
  };
      
  onDelete = (index) => {
    const photos = this.props.value.slice(0);
    photos.splice(index, 1);
    this.props.onChange(photos);
  }

  onFilesSelected = (...rest) => {
    if(this.props.onFilesSelected) {
      this.props.onFilesSelected(...rest);
    }
  }  

  render() {
    const { value, label, dropZoneConfig, disabled } = this.props;
    const { rejectedFiles } = this.state;
    const hasRejectedFiles = (rejectedFiles && rejectedFiles.length > 0);
    const isNewPhoto = (value && value.preview);

    const currentPhoto = isNewPhoto ? 
      // The file is new - show a preview of file to be uploaded
      (<img src={value.preview} alt={`${value.name} - ${value.size/1000000}MB`} />) 
      // The file is pre-existing - show the image
      : (<img src={value} alt="Profile" />)

    if(!disabled) {
      // Is editable, show the gallery builder form
      return (
        <div className="o-profile-photo-uploader">
          { label && (<Label>{label}</Label>)}
          <div className={`o-profile-photo ${isNewPhoto ? 'o-new-photo' : 'o-existing-photo'}`}>
            <DropZone 
              {...dropZoneConfig}
              className="o-profile-photo-drop-zone" 
              accept="image/jpeg, image/png" 
              onDrop={this.onDrop}
              style={{ backgroundImage: `url(${isNewPhoto ? value.preview : value})` }}
              >
              <IconButton
                className="o-toggle-picker"
                onClick={this.toggleShowPicker}
                shape="square">
                  <Edit />
              </IconButton>
            </DropZone>
          </div>

          {hasRejectedFiles && (
            <FormGroup className="o-form-control">
              {/* Trigger bootstrap validation styling */}
              <input type="hidden" className="is-invalid" />

              {/* Display files that we refused to upload */}
              {rejectedFiles && (
                <FormFeedback>
                  File could not be uploaded
                </FormFeedback>
              )}
            </FormGroup>
          )}
        </div>
      );
    }

    return (
      <div>
        {currentPhoto}
      </div>
    );

  }
}

PhotoUploader[internalFieldNames.COMPONENT_NAME] = 'PhotoUploader';

PhotoUploader.propTypes = {
  disabled: PropTypes.bool,
  label: PropTypes.string,
  onFilesSelected: PropTypes.func,
  dropzoneConfig: PropTypes.shape(), // see https://react-dropzone.netlify.com/#src
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
  value: PropTypes.oneOfType([
    PropTypes.string, 
    PropTypes.shape({
      caption: PropTypes.string,
      file: PropTypes.instanceOf(File)
    })
  ]),
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
  validationMessages: PropTypes.arrayOf(
    PropTypes.shape({
      errorType: PropTypes.oneOf(['general', 'caption']).isRequired,
      errorMessage: PropTypes.string.isRequired,
      photoIndex: PropTypes.number
    })
  )
}

export default PhotoUploader;