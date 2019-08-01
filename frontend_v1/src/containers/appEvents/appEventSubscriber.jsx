import React from 'react';
import service from './globalAppEventPublisher';


function appEventSubscriber(WrappedComponent) {
  // React pure function component
  return (props) => (
    <WrappedComponent 
      {...props}
      subscribeToAppEvent={service.addEventListener} 
      unsubscribeFromAppEvent={service.removeEventListener} />
  );
};


export default appEventSubscriber;