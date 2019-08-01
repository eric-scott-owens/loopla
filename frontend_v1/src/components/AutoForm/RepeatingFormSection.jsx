import React from 'react';
import PropTypes from 'prop-types';
import { Label, Row, Col } from 'reactstrap';
import Close from '@material-ui/icons/Close';
import Add from '@material-ui/icons/Add';
import uuidv1 from 'uuid';

import IconButton from '../IconButton';
import IconTextButton from '../IconTextButton';
import { internalFieldNames } from './AutoForm';

import './RepeatingFormSection.scss';

// eslint-disable-next-line
/*************************************************
 ** WARNING: 
 **   RepeatingFormSection is tightly coupled to
 **   AutoForm. Changes here or there will likely
 **   required changes in the other.
 ************************************************/

class RepeatingFormSection extends React.Component {

  constructor(props) {
    super(props);

    // Used to force a redraw of the contents if 
    // The array is changed out
    this.arrayIdentity = uuidv1();
  }

  shouldComponentUpdate(nextProps) {
    if(this.props.value !== nextProps.value) {
      // Force a redraw or array elements (they get rekeyed)
      this.arrayIdentity = uuidv1();
    }

    return true;
  }

  render() {
    const {
      valuePath,
      children, 
      className, 
      label,
      disableRowDeletion,
      onDeleteRow,
      onAddRow,
      onAddRowValueProvider,
      onAddRowButtonText
    } = this.props;
    
    return (
      <div className={`o-repeating-form-section ${className}`}>
        { !label ? null : <Label>{label}</Label>}
        { children && children.map && children.map( (child, index) => {
          const childValuePath = `${valuePath}[${this.arrayIdentity}][${index}]`;
          const localIndex = index; // encapsulate the index at this point in this scope so that it doesn't change
          return (
            <Row
              key={childValuePath}
              className={`${index > 0 ? 'o-xs-divider' : '' } form-row`}>
              <Col xs={disableRowDeletion ? '12' : '11'}>
                {child}
              </Col>
    
              {!disableRowDeletion && (
                <Col xs="1">
                  <IconButton
                    onClick={() => onDeleteRow(valuePath, localIndex)} 
                    className="o-delete-line">
                    <Close />
                  </IconButton>
                </Col>
              )}
            </Row>
          );
        })}
        { onAddRow && (
          <IconTextButton 
            onClick={() => onAddRow(valuePath, onAddRowValueProvider)}
            shape="circle"
            color="secondary"
            text={onAddRowButtonText || 'Add' }>
            <Add /> 
          </IconTextButton>
        )}
      </div>
    );
  }
}

RepeatingFormSection[internalFieldNames.COMPONENT_NAME] = 'RepeatingFormSection';

RepeatingFormSection.propTypes = {
  // RepeatingFormSection should only be used within 
  // an AutoForm. AutoForm uses valuePath directly.
  // eslint-disable-next-line
  valuePath: PropTypes.string.isRequired,

  className: PropTypes.string,
  label: PropTypes.string,
  
  disableRowDeletion: PropTypes.bool,

  onDeleteRow: PropTypes.func, // Added by AutoForm

  onAddRow: PropTypes.func, // Added by AutoForm
  onAddRowValueProvider: PropTypes.func.isRequired,
  onAddRowButtonText: PropTypes.string
}

export default RepeatingFormSection;