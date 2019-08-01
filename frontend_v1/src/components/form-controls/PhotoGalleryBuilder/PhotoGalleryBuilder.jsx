import React from 'react';
import PropTypes from 'prop-types';
import arrayMove from 'array-move';
import DropZone from 'react-dropzone';
import { FormGroup, Label, FormFeedback } from 'reactstrap';
import ReactGallery from 'react-photo-gallery';
import { SortableContainer, SortableElement } from "react-sortable-hoc";

import forEach from 'lodash/forEach';
import configuration from '../../../configuration';
import Gallery from '../../Gallery';
import ValidationMessages from '../ValidationMessages';
import DraggablePhoto from './DraggablePhoto';
import { internalFieldNames } from '../../AutoForm';

import './PhotoGalleryBuilder.scss';

function columns(containerWidth) {
  let columnCount = 1;
  if (containerWidth >= 450) columnCount = 2;
  if (containerWidth >= 700) columnCount = 3;
  if (containerWidth >= 900) columnCount = 4;
  if (containerWidth >= 1500) columnCount = 5;
  return columnCount;
}

const SortablePhoto = SortableElement(DraggablePhoto);
const SortableGallery = SortableContainer(({ photos }) => <ReactGallery photos={photos} columns={columns} ImageComponent={SortablePhoto} /> );

class PhotoGalleryBuilder extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rejectedFiles: []
    }
  }

  onSortEnd = ({ oldIndex, newIndex }) => {
    const photoCollection = {...this.props.value};
    let photos = photoCollection.photoCollectionPhotos.slice(0);
    photos = arrayMove(photos, oldIndex, newIndex);
    photoCollection.photoCollectionPhotos = photos;
    this.props.onChange(photoCollection);
  }

  /**
   * Handles files being added to the photo gallery builder
   */
  onDrop = async (acceptFiles, rejectFiles) => {
    const captionedFiles = await this.getPhotoDimensions(acceptFiles);

    // Send valid photos on to the object being edited
    const photoCollection = {...this.props.value};
    const photos = photoCollection.photoCollectionPhotos.slice(0);

    // Add new photos
    let orderingIndex = photos.length;
    forEach(captionedFiles, photo => {
      photos.push(
        // New photoCollectionPhoto  
      {
        orderingIndex,
        photo
      });

      orderingIndex += 1;
    });
    
    photoCollection.photoCollectionPhotos = photos;
    this.props.onChange(photoCollection);

    // Propagate changes to the rejected files
    this.setState((state) => { 
      const rejectedFiles = [ ...state.rejectedFiles, ...rejectFiles];
      return { rejectedFiles }
    });

    this.onFilesSelected();
  };

  onUpdateCaption = (photoIndex, caption) => {
    const photoCollection = {...this.props.value};
    const photos = photoCollection.photoCollectionPhotos.slice(0);
    const photoCollectionPhoto = photos[photoIndex];

    // Create a new photo object with the new caption applied via
    // an entry in a parent wrapper.
    // 
    // If we don't do this we are lead to mutate photo.file... as
    // using Object.assign or the ... operator on a File object
    // strips away most of the fields and we can no longer upload
    // it. 
    const updatedPhoto = Object.assign({}, photoCollectionPhoto.photo, { caption });

    // Replace the photo instance in our 
    photoCollectionPhoto.photo = updatedPhoto;
    photos[photoIndex] = photoCollectionPhoto;
    photoCollection.photoCollectionPhotos = photos;
    this.props.onChange(photoCollection);
  }

  onDelete = (index) => {
    const photoCollection = {...this.props.value};
    const photos = photoCollection.photoCollectionPhotos.slice(0);
    photos.splice(index, 1);
    photoCollection.photoCollectionPhotos = photos;
    this.props.onChange(photoCollection);
  }

  onFilesSelected = (...rest) => {
    if(this.props.onFilesSelected) {
      this.props.onFilesSelected(...rest);
    }
  }

  getPhotoDimensions = (acceptFiles) => {
    const captionedFiles = acceptFiles.map((file) => ({caption: "", file, height: 0, width: 0}));

    const filePromises = [];

    forEach(captionedFiles, singleFile => {
      
      let myResolve;
      const myPromise = new Promise((resolve) => {
        myResolve = resolve;
      });

      filePromises.push(myPromise);
      const myImgUrl = window.URL || window.webkitURL;
      const i = new Image();
      
      i.onload = () => {
        // eslint-disable-next-line no-param-reassign
        singleFile.width = i.width;
        // eslint-disable-next-line no-param-reassign
        singleFile.height = i.height;
        myImgUrl.revokeObjectURL(singleFile.file);
        singleFile.src = singleFile.file.preview;
        myResolve(singleFile);
      }

      i.src = myImgUrl.createObjectURL(singleFile.file);
    });

    const returnFiles = Promise.all(filePromises).then((files) => files);

    return returnFiles;
  }

  render() {
    const { value, label, disabled, canDelete, validationMessages, isDirty, dropZoneConfig } = this.props;
    const { rejectedFiles } = this.state;
    const generalValidationMessages = validationMessages ? validationMessages.filter(m => m.errorType === 'general') : [];
    const hasRejectedFiles = (rejectedFiles && rejectedFiles.length > 0);

    const photoCollection = value;
    const photoCollectionPhotos = 
            photoCollection && photoCollection.photoCollectionPhotos ? photoCollection.photoCollectionPhotos : [];

    const photos = photoCollectionPhotos.map((photoCollectionPhoto, index) => {
      const { photo } = photoCollectionPhoto;
      const isNewPhoto = !!photo.file;
      const photoValidationMessages = 
        validationMessages ? 
          validationMessages.filter(message => message.photoIndex === index) 
          : 
          [];

      const src = isNewPhoto ? photo.src : `${configuration.API_ROOT_URL}/components/photo-collections/thumbnails/${photo.id}/`;

      return {
        src,
        caption: photo.caption,
        height: photo.height,
        width: photo.width,
        validationMessages: photoValidationMessages,
        isNewPhoto,
        isDirty,
        disabled,
        onDelete: canDelete ? () => this.onDelete(index) : undefined,
        onUpdateCaption: (caption) => this.onUpdateCaption(index, caption),
        dataObject: photoCollectionPhoto
      }
    });

    if(!disabled) {
      // Is editable, show the gallery builder form
      return (
        <FormGroup className="o-photo-gallery-builder o-form-control">
          { label && (<Label>{label}</Label>)}
          
          

          <div className="photo-gallery-builder-preview">
            <SortableGallery
              axis="xy"
              photos={photos}
              onSortEnd={this.onSortEnd} />  
          </div>

          <DropZone 
            {...dropZoneConfig}
            className="drop-zone" 
            accept="image/jpeg, image/png, image/gif" 
            onDrop={this.onDrop}
          >
            {/* <CloudUpload /> */}
            <span className="o-drop-zone-text">
              Drop photos here or <span className="o-underline-text">Browse</span>
            </span>
            {/* <div className="o-tiny-drop-zone-text">jpeg, png, gif allowed</div> */}
          </DropZone>

          {hasRejectedFiles && (
            <React.Fragment>
              {/* Trigger bootstrap validation styling */}
              <input type="hidden" className="is-invalid" />

              {/* Display files that we refused to upload */}
              {rejectedFiles && (
                <FormFeedback>
                  These files could not be uploaded as images:
                  <ul className="o-rejected-files">
                    {rejectedFiles && rejectedFiles.map(file => (<li key={file.name}>{file.name} - {(file.size/1000).toFixed(2)} KB</li>) )}
                  </ul>
                </FormFeedback>
              )}
            </React.Fragment>
          )}

          {/* Display validation messages */}
          {isDirty && (
            <ValidationMessages value={generalValidationMessages.map(m => m.errorMessage)} />
          )}

        </FormGroup>
      );
    }

    // Not editable, just display
    return (
      <Gallery photos={photos} />
    );
  }
}

PhotoGalleryBuilder[internalFieldNames.COMPONENT_NAME] = 'PhotoGalleryBuilder';

PhotoGalleryBuilder.propTypes = {
  disabled: PropTypes.bool,
  canDelete: PropTypes.bool.isRequired,
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
  value: PropTypes.shape({
    photoCollectionPhotos: PropTypes.arrayOf(
      PropTypes.shape({
        orderingIndex: PropTypes.number.isRequired,
        photo: PropTypes.shape({
          caption: PropTypes.string,
          width: PropTypes.number.isRequired,
          height: PropTypes.number.isRequired
        })
      })
    )
  }),

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

export default PhotoGalleryBuilder;