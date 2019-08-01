import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { FormGroup } from 'reactstrap';

import configuration from '../../../configuration';
import { newKeyFor } from '../../../utilities/ObjectUtilities';
import { createGroup } from '../../../containers/loops/actions';
import { getCurrentUser } from '../../../containers/users/actions';
import { fetchMembershipsForUser } from '../../../containers/loops/memberships/actions';
import CreateLoopValidator from '../../../containers/loops/create/validator';
import { canCurrentUserCreateNewLoops } from '../../../containers/users/reducers';
import { navigateTo } from '../../../containers/history/AppNavigationHistoryService';
import { getLoopDashboardUrl } from '../../../utilities/UrlUtilities';

import AutoForm from '../../../components/AutoForm';
import TextField from '../../../components/form-controls/TextField';
import TextArea from '../../../components/form-controls/TextArea';
import PageInitializer from '../../PageInitializer';
import Page from '../../Page';
import ErrorPage403 from '../../error/403';
import PageBackButton from '../../../components/PageBackButton';

import "./CreateLoopPage.scss";

const validator = new CreateLoopValidator();

const emptyFormData = { 
  model: configuration.MODEL_TYPES.group,
  id: newKeyFor(configuration.MODEL_TYPES.group), 
  circle: {
    name: '',
    description: '' 
  }
};

class CreateLoopPage extends React.Component {
 
  onCreateNewLoopCompleteHandler = (formData, props, loop) => {
    this.props.dispatchGetCurrentUser();
    this.props.dispatchFetchUpdatedMemberships(this.props.currentUser);
    navigateTo(getLoopDashboardUrl(loop.id));
  }

  createNewLoopHandler = (formData) => this.props.dispatchCreateLoop(formData);

  submitButtonTextProvider = (editingObject, props, isProcessing) => isProcessing ? 'Creating Loop...' : 'Create Loop';

  render() {
    const { blockNewLoopCreation } = this.props;

    if(blockNewLoopCreation) return (
      <PageInitializer>
        <Page>
          <ErrorPage403 />
        </Page>
      </PageInitializer>
    );

    return (
      <PageInitializer>
        <Page className="o-create-loop-page text-center">
          <PageBackButton>
          CANCEL
          </PageBackButton>
          <React.Fragment>
            {/* image visible on xs and sm devices */}
            <img className="d-md-none o-img-center" src={`${configuration.SITE_RESOURCES_URL}/frontend_v1/media/monsters/loopla_monster_lasso_mobile.png`} alt="monster" height="307" width="265" data-pin-nopin="true" />
            {/* image visible on md, lg, and xl devices */}
            <img className="d-none d-md-block o-img-center" src={`${configuration.SITE_RESOURCES_URL}/frontend_v1/media/monsters/loopla_monster_lasso.png`} alt="monster" height="351" width="303" data-pin-nopin="true"/ >
            <h1>Create a Loop</h1>
            No pressure. You can edit loop name and description anytime.

            <AutoForm
              data={emptyFormData}
              validator={validator}
              processingHandler={this.createNewLoopHandler}
              onProcessingComplete={this.onCreateNewLoopCompleteHandler}
              processingButtonText={this.submitButtonTextProvider}
              processingButtonClassName="o-button-center">
              <FormGroup className="o-m-top-xl">
                <TextField 
                  valuePath="circle.name"
                  placeholder="Loop Name*" />
              </FormGroup>
              <FormGroup className="o-m-bottom-xl">
                <TextArea
                  valuePath="circle.description"
                  placeholder="Loop Description" />
              </FormGroup>
            </AutoForm>
          </React.Fragment>
        </Page>
      </PageInitializer>
    )
  } 
}

const mapStateToProps = (state) => {
  const currentUser = state.users[state.currentUserId];
  const blockNewLoopCreation = !canCurrentUserCreateNewLoops(state);
  return { currentUser, blockNewLoopCreation };
}

const mapDispatchToProps = (dispatch) => ({
  dispatchCreateLoop: (formData) => dispatch(createGroup(formData)),
  dispatchGetCurrentUser: () => dispatch(getCurrentUser()),
  dispatchFetchUpdatedMemberships: (currentUser) => dispatch(fetchMembershipsForUser(currentUser.id))
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(CreateLoopPage));