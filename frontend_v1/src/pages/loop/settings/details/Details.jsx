import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Row, Col } from 'reactstrap';

import configuration from '../../../../configuration';
import { newKeyFor, getBlankModelFor, isObjectNew as isLoopNew } from '../../../../utilities/ObjectUtilities';
import * as groupActions from '../../../../containers/loops/actions';
import { removeEditingObject } from '../../../../actions/editingObjects'
import { isCurrentUserCoordinatorOf } from '../../../../containers/loops/memberships/reducers';

import PageInitializer from '../../../PageInitializer';
import StateSelector from '../../../../components/form-controls/StateSelector';
import AutoForm from '../../../../components/AutoForm';
import TextField from '../../../../components/form-controls/TextField';
import TextArea from '../../../../components/form-controls/TextArea';
import DetailsValidator from '../../../../containers/loops/details/validator';

import './Details.scss';

const validator = new DetailsValidator();

class Details extends React.Component {
  
  componentWillUnmount() {
    const loopId = this.props.id;
    this.props.dispatchRemoveEditingObject(loopId);
  }

  onCancel = () => {
    const { loop } = this.props;
    if(this.props.onCancel) {
      this.props.onCancel(loop);
    }
  }

  onSaveComplete = (loop) => {
    if(this.props.onSaveComplete) {
      this.props.onSaveComplete(loop);
    }
  }

  getProcessingButtonText = (loop, props, isProcessing) => {
    if(isLoopNew(loop)) {
      return isProcessing ? 'Creating...' : 'Create Loop';
    }

    return isProcessing ? 'Saving...' : 'Save';
  }

  saveLoop = (loop) => {
    if (isLoopNew(loop)) {
      this.props.dispatchCreateLoop(loop)
    } 
    else {
      this.props.dispatchUpdateLoop(loop);
    }
  }
  
  render() {
    const { loop, isCoordinator } = this.props;
    if(!loop) return null;

    return (
      <PageInitializer>
        <div className={`o-loop-settings-details ${isCoordinator ? '' : 'pb-3'}`}>
          <AutoForm
            data={loop}
            processingHandler={this.saveLoop}
            onProcessingComplete={this.onSaveComplete}
            onCancel={this.onCancel}
            validator={validator}
            processingButtonText={this.getProcessingButtonText}
            dontRemoveEditingObjectAfterSave
            hideToolbar={!isCoordinator}
          >
            <TextField
              valuePath="circle.name"
              className="o-loop-name"
              placeholder="Loop Name*"
              disabled={!isCoordinator} />

            <Row className="form-row">
              <Col sm="6">
                <TextField
                  valuePath="circle.city"
                  className="o-loop-city"
                  placeholder="City"
                  disabled={!isCoordinator} />
              </Col>
              <Col sm="6">
              <StateSelector
                  valuePath="circle.state"
                  className="o-loop-state"
                  placeholder="State"
                  disabled={!isCoordinator} />
              </Col>
            </Row>

            <TextArea
              valuePath="circle.description"
              className="o-loop-description"
              placeholder="Loop Description"
              disabled={!isCoordinator} />
            
          </AutoForm>
        </div>
      </PageInitializer>
    );
  }


};

Details.propTypes = {
  // eslint-disable-next-line
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  onCancel: PropTypes.func,
  onSaveComplete: PropTypes.func
};

const mapStateToProps = (state, props) => {
  const loopId = props.id;
  let { loop } = props;
  if(!loop) {
    if(loopId === newKeyFor(configuration.MODEL_TYPES.group)) {
      loop = getBlankModelFor(configuration.MODEL_TYPES.group);
    } else {
      loop = state.groups[loopId];
    }
  }

  // TODO: Add permissions to edit page
  const { currentUserId } = state;
  const isCoordinator = isCurrentUserCoordinatorOf(state, loopId);
  return { loop, isCoordinator, currentUserId };
};

const mapDispatchToProps = (dispatch) => ({
  dispatchCreateLoop: (createdLoop) => dispatch(groupActions.createGroup(createdLoop)),
  dispatchUpdateLoop: (updatedLoop) => dispatch(groupActions.updateGroup(updatedLoop)),
  dispatchRemoveEditingObject: (loopId) => dispatch(removeEditingObject(loopId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Details);
