import React from 'react';
import ProgressBar from '../ProgressBar';

import globalAppEventPublisher from '../../containers/appEvents/globalAppEventPublisher';
import { EVENT_NAMES } from '../../middleware/fetchMiddleware/FetchStateTracker';

import './SystemActivityIndicator.scss';

class DataLoadingIndicator extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isTransferringData: true
    };

    globalAppEventPublisher.addEventListener(this.updateLoadingState, EVENT_NAMES.loadingStateUpdated);
  }

  componentWillUnmount() {
    globalAppEventPublisher.removeEventListener(this.updateLoadingState, EVENT_NAMES.loadingStateUpdated);
  }

  updateLoadingState = (appEvent) => {
    this.setState({ isTransferringData: appEvent.data.isTransferringData });
  }

  render() {
    const { isTransferringData } = this.state;
    return (
      <div className="o-system-activity-indicator">
        { isTransferringData && <ProgressBar />}
      </div>
    );
  }
} 

export default DataLoadingIndicator;