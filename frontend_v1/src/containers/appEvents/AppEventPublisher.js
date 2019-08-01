import forEach from 'lodash/forEach';
import concat from 'lodash/concat';
import uniq from 'lodash/uniq';
import AppEvent from './AppEvent';


/**
 * Creates an event publisher for App events to which
 * other consumers can subscribe
 */
function AppEventPublisher(){

  // Dictionary holding arrays of listeners registered to listen
  // to specific event types by name.
  // * Dictionary is index by event name
  const eventListeners = {
    '*': [] // Listeners subscribing to all events
  };


  /**
   * Publishes an event to all registered subscribers
   * @param {string} eventName - The named event being published
   * @param {*} data 
   * @param {*} event 
   */
  this.publishEvent = (eventName, data, event) => {
    const name = eventName || '*';

    if(!eventListeners[name]){
      eventListeners[name] = [];
    }

    // Get the current subscribers
    let currentSubscribers = concat([], eventListeners['*']);
    if(name !== '*') {
      currentSubscribers = concat(currentSubscribers, eventListeners[name]);
    }

    // Uniqueify subscribers in the event one is registered to both * and eventName
    currentSubscribers = uniq(currentSubscribers);

    // create event message
    const appEvent = new AppEvent(name, event, data);

    // Notify subscribers
    forEach(currentSubscribers, subscriber => { subscriber(appEvent); });
  }


  this.addEventListener = (callbackFunc, eventName) => {
    const name = eventName || '*';

    if(!(callbackFunc instanceof Function)) {
      throw new Error('Critical error, callbackFunc must be a function.')
    }
    
    if(!eventListeners[name]){
      eventListeners[name] = [];
    }

    eventListeners[name].push(callbackFunc);
  }


  this.removeEventListener = (callbackFunc, eventName) => {
    const name = eventName || '*';

    if(!(callbackFunc instanceof Function)) {
      throw new Error('Critical error, callbackFunc must be a function.')
    }
    
    if(eventListeners[name]){
      const index = eventListeners[name].indexOf(callbackFunc);
      if(index > -1) {
        eventListeners[name].splice(index, 1);
      }
    }
  }


  /**
   * Returns a count of the number of event listeners registered to listen to the named event.
   * @param {string} eventName - The named event for which a count of listeners is being requested
   * 
   * @returns {int} - The number of listeners currently registered to listen for this type of event
   */
  this.getEventListenerCountFor = (eventName) => {
    if(!eventListeners[eventName]){
      return 0;
    }

    return eventListeners[eventName].length;
  }

}

export default AppEventPublisher;
