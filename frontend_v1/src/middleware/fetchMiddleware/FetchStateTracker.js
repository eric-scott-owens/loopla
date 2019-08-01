import debounce from 'lodash/debounce';
import { newKeyFor } from '../../utilities/ObjectUtilities';

// Define supported event names
export const EVENT_NAMES = {
  loadingStateUpdated: 'loading-state-updated'
};

export default class FetchStateTracker {
  constructor(eventPublisher) {
    this.pendingRequests = {};
    this.pendingRequestCount = 0;
    this.lastPublishedIsTransferringData = false;
    this.eventPublisher = eventPublisher;
    this.debouncedPublishLoadingState = debounce(this.publishLoadingState, 500, { leading: true, trailing: true });
  }

  static generateRequestId(url, params) {
    const key = newKeyFor('FETCH-ACTION', { url, ...params});
    return key;
  }

  addPendingRequest(url, params) {
    const requestId = FetchStateTracker.generateRequestId(url, params);
    this.pendingRequests[requestId] = {url, params};
    this.pendingRequestCount += 1;
    this.debouncedPublishLoadingState();
  }

  removePendingRequest(url, params) {
    const requestId = FetchStateTracker.generateRequestId(url, params);
    delete this.pendingRequests[requestId];
    this.pendingRequestCount -= 1;
    this.debouncedPublishLoadingState();
  }

  isTransferringData() {
    return (this.pendingRequestCount > 0);
  }

  publishLoadingState = () => {
    if(this.eventPublisher) {
      const isTransferringData = this.isTransferringData();
      if(this.lastPublishedIsTransferringData !== isTransferringData) {
        this.lastPublishedIsTransferringData = isTransferringData;
        this.eventPublisher.publishEvent('loading-state-updated', { isTransferringData });
      }
    }
  } 
};