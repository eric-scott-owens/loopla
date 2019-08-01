import React from 'react';
import Joyride, { 
  ACTIONS as JOYRIDE_ACTIONS,
  LIFECYCLE as JOYRIDE_LIFECYCLE,
  STATUS as JOYRIDE_STATUS, 
  EVENTS as JOYRIDE_EVENTS
}  from 'react-joyride';

import { scrollToElement, scrollToTopOfPage, addBodyClass, removeBodyClass } from '../../utilities/StyleUtilities';

import './Joyride.scss';

const swapCloseAndSkipFunctions = (storeHelpers) => {
  const { skip } = storeHelpers;
  const { close } = storeHelpers;

  // Yes... this is the way Joyride is designed to be overridden

  // eslint-disable-next-line
  storeHelpers.close = skip;

  // eslint-disable-next-line
  storeHelpers.skip = close;
}

const styles = {
  options: {
    arrowColor: '#fff',
    backgroundColor: '#fff',
    overlayColor: 'rgba(0, 0, 0, 0.5)',
    primaryColor: '#3ea9f5',
    spotlightShadow: '0 0 15px rgba(0, 0, 0, 0.5)',
    textColor: '#011b28',
    width: undefined,
    zIndex: 2000,
  }
};


class JoyrideWithSwappedCloseAndSkipFunctionality extends React.PureComponent {

  handleJoyrideCallback = (data) => {
    // Call any other handlers
    if(this.props.callback) {
      this.props.callback(data);
    }

    // Implement better scrolling
    const { action, lifecycle, status, type, step } = data;

    if (type === JOYRIDE_EVENTS.TOUR_START || lifecycle === JOYRIDE_LIFECYCLE.INIT) {
      addBodyClass('overflow-hidden');
    }

    if (type === JOYRIDE_EVENTS.TOUR_END) {
      removeBodyClass('overflow-hidden');
    }

    if (
      action === JOYRIDE_ACTIONS.PREV
      && lifecycle === JOYRIDE_LIFECYCLE.COMPLETE
      && status === JOYRIDE_STATUS.RUNNING
      && type === JOYRIDE_EVENTS.STEP_AFTER
    ){
      // if(index === TOUR_STEP_INDICES.NEW_POST) {
      //   // We are headed back to the the loop tags step. We need to scroll up first.
      scrollToTopOfPage({ behavior: 'auto' });
    }

    if(
      !this.props.disableScrolling
      && status === JOYRIDE_STATUS.RUNNING 
      && type === JOYRIDE_EVENTS.TOOLTIP
      && step
    ) {
      // Sadly, this isn't consistent without the timeout...
      setTimeout(() => {
        const element = document.querySelector(step.target);
        scrollToElement(element, { bottomOffset: 200 });
      }, 10);
    }
  }

  render() {
    // Extract the props we want to handle ourselves,
    // Pass on the rest
    const { callback, disableScrolling, ...otherProps } = this.props;

    return (
      <Joyride
        styles={styles}
        getHelpers={swapCloseAndSkipFunctions}
        disableScrolling
        callback={this.handleJoyrideCallback}
        {...otherProps}
      />
    );
  }
}

export default JoyrideWithSwappedCloseAndSkipFunctionality
