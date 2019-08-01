import AppEventPublisher from './AppEventPublisher';

// Define supported event names
export const APP_EVENT_NAMES = {
  startPageTour: 'start-page-tour'
};

const globalAppEventPublisher = new AppEventPublisher();
export default globalAppEventPublisher;