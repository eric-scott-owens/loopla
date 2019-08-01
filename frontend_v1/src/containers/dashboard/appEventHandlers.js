import { receiveNewDashboardPostData } from './actions';

let store;

export function handleNewDashboardPostDataReceivedEvent(appEvent) {
  store.dispatch(receiveNewDashboardPostData(appEvent.data));
}

export function setupHandleNewDashboardPostDataReceivedEvent(storeInstance) {
  store = storeInstance;
}