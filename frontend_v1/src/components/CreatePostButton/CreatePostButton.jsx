import React from 'react';
import Add from '@material-ui/icons/Add';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import configuration from '../../configuration';
import IconTextButton from '../IconTextButton';

import { navigateTo } from '../../containers/history/AppNavigationHistoryService';

import "./CreatePostButton.scss";

class CreatePostButton extends React.Component {
  componentDidMount() {

  }

  onCreate = () => {
    navigateTo(`${configuration.APP_ROOT_URL}/posts/new`);
  }


  render() {
    const { disabled, className, staticContext, ...others} = this.props;
    return ( 
      <IconTextButton 
        {...others}
        className={`o-create-post-button ${className || ''} ${disabled? 'disabled' : ''}`}
        onClick={this.onCreate}
        text="Create Post"
        shape="circle" color="primary"
        textWidth="160px"
      >
        <Add />
      </IconTextButton>
    );
  } 
}

CreatePostButton.propTypes = {
  className: PropTypes.string,
  disabled: PropTypes.bool
}

export default withRouter(CreatePostButton);