import forEach from 'lodash/forEach';
import isEqual from 'lodash/isEqual';
import configuration from '../../configuration';

const appHistory = [];
const rootUrl = `${configuration.APP_ROOT_URL}/`
let routerHistory; // the React Router compatible History object

/**
 * Makes sure that all the navigation functions throw an understandable error 
 * if we haven't initialized this service.
 */
function ensureServiceIsInitialized() {
  if(!routerHistory) {
    throw new Error('The AppNavigationHistoryService cannot be used until it has been initialized.');
  }
}

/**
 * Replaces the current navigation URL with a new one rather than adding
 * a new url to the history chain.
 * @param {*} location - The new location to navigate to as a replace action in the history
 */
export function replaceCurrentNavigation(location) {
  ensureServiceIsInitialized();
  routerHistory.replace(location);
}

/**
 * Navigates backward within the app one step. If not possible,
 * we navigate to the root as the first step.
 */
export function navigateBack() {
  ensureServiceIsInitialized();
  
  if(appHistory.length === 1) {
    replaceCurrentNavigation(rootUrl);
  }
  
  if(appHistory.length > 1) {
    routerHistory.goBack();
  }
}

/**
 * Navigates backward within the app until we reach the requested URL.
 * If the requested URL isn't found in the apps navigation history, the
 * history will be emptied with the requested URL used as the new first
 * element.
 * @param {string} location - The location to navigate backwards to.
 */
export function navigateBackTo(location) {
  ensureServiceIsInitialized();
  
  const pathname = location.pathname ? location.pathname : location;
  let countDistanceBack = 0;
  let doesStateForceNavigationReplacement = false;

  // Check all but he very first one...
  for(let i = appHistory.length - 1; i >= 0; i -=1) {
    if(appHistory[i].pathname === pathname) {

      if(!isEqual(appHistory[i].state, location.state)) {
        doesStateForceNavigationReplacement = true;
      }

      break; // We've found our new home
    }

    // Haven't found home yet... keep navigating.
    countDistanceBack += 1;
  }

  const isGoingAllTheWayBack = appHistory.length === countDistanceBack;

  // If we are going all the way back we want to trigger 1 goBack short of our
  // history length so that we can replace the last entry with our path name 
  // rather than navigating out of the application.
  let countOfBacksToInvoke = isGoingAllTheWayBack ? countDistanceBack - 1 : countDistanceBack;

  // Navigate back the appropriate amount
  while(countOfBacksToInvoke > 0) {
    routerHistory.goBack();
    appHistory.pop();
    countOfBacksToInvoke -= 1;
  }

  // If we got to the point that only one item is in the app history
  // and we aren't where we belong, we better use replacement.
  //
  // Or, if we are passing a different state to use at that location
  // we better use replacement.
  if (isGoingAllTheWayBack || doesStateForceNavigationReplacement) {
    setTimeout(() => { replaceCurrentNavigation(location); }, 10);
  }

}

/**
 * Navigates to the requested location
 * @param {*} location - The location to navigate to
 */
export function navigateTo(location) {
  ensureServiceIsInitialized();
  routerHistory.push(location);
}

/**
 * Handles appHistory synchronization of browser navigation events
 * @param {*} location 
 * @param {*} action 
 */
function historyListener(location, action) {
  // Sync back button navigation
  if (action === 'POP') {
    // Update the appHistory if this was a browser back button event
    if (
      appHistory.length > 1 
      && location.pathname === appHistory[appHistory.length - 2].pathname
      && location.key === appHistory[appHistory.length -2].key
    ) {
      appHistory.pop();
    }
    else {
      // check if this is really a browser forward button event
      let foundMatch = false;
      forEach(appHistory, storedLocation => {
        if(location.pathname === storedLocation.pathname && location.key === storedLocation.key) {
          foundMatch = true;
        }

        return !foundMatch; // break loop if found;
      });

      if(!foundMatch) {
        // Yup, it's really a forward browser event
        appHistory.push(location);
      }
    }
  }
    
  if (action === 'PUSH') {
    appHistory.push(location);
  }

  if (action === 'REPLACE') {
    if(appHistory.length > 0) {
      appHistory.pop();
    }
    
    appHistory.push(location);
  }

}

/**
 * Initializes the AppNavigationHistoryService by providing
 * the needed react router history object to the service
 * @param {*} reactRouterHistory 
 */
export function init(reactRouterHistory) {
  if(
    !reactRouterHistory.goBack 
    || !reactRouterHistory.replace
  ) {
    throw new Error('Invalid react router compatible history object provided.');
  }

  routerHistory = reactRouterHistory;
  appHistory.push(reactRouterHistory.location);
  routerHistory.listen(historyListener);
}

