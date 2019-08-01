import forEach from 'lodash/forEach';

/**
 * FreezingStateTableWithPartialLoading
 * this object 
 */
function FreezingStateTableWithPartialLoading() {

  // The frozen state "table" published for consumption
  let publishedTableValue = {};

  // The frozen state "table" being built for publication
  // once the current loading job is completed.
  let loadingTableValue = {};

  // The ids to be displayed in the order they should be displayed
  let idsToDisplay = [];

  // The published display data
  let publishedDisplay = [];

  // A dictionary tracking IDs for which the state is
  // awaiting resource data so that loading can be
  // concluded and a frozen state can be presented.
  let idsAwaitingDataLoad = {};
  let idsAwaitingDataLoadCount = 0;

  // A dictionary tracking IDs for which the frozen
  // state is now out of date and new data has been 
  // detected that could replace it.
  let idsForWhichUpdatedDataIsAvailable = {};
  let idsForWhichUpdatedDataIsAvailableCount = 0;

  /**
   * Indicates whether or not this instance of FreezingStateTableWithPartialLoading
   * is currently waiting on data before it's load for the current state con be
   * considered complete.
   */
  this.isLoading = () => idsAwaitingDataLoadCount > 0;

  /**
   * Indicates whether or not the frozen state has been detected as being out of date
   * with the most recent data presented from the data store.
   */
  this.isUpdatedDataAvailable = () => idsForWhichUpdatedDataIsAvailableCount > 0;

  /**
   * Returns the published frozen state for which loading was last completed.
   */
  this.getPublishedFrozenState = () => publishedTableValue;

  this.getPublishedDisplay = () =>   publishedDisplay;

  function isUpdateRequired() {
    // check if the arrays are a different length, if they are... we need to update!
    let needToUpdate = idsToDisplay.length !== publishedDisplay.length;

    // check if the items in the arrays match the ids to be displayed
    // But only if we don't already know we need to update
    if(!needToUpdate) {
      for(let i = 0, iLength = idsToDisplay.length; i < iLength; i += 1) {
        if(idsToDisplay[i] !== publishedDisplay[i].id) {
          needToUpdate = true;
          break;
        }
      }
    }

    return needToUpdate;
  }

  function updatePublishedDisplay(options) {
    if((options && options.force) || isUpdateRequired()) {
      // Move all loading data into the published table
      publishedTableValue = {...publishedTableValue, ...loadingTableValue};
  
      // Reset the array of objects to display and populated it
      publishedDisplay = [];
      forEach(idsToDisplay, id => {
        const resource = publishedTableValue[id];
        publishedDisplay.push(resource);
      });
    }    
  }

  /**
   * Resets this instance of FreezingStateTableWithPartialLoading
   * preparatory for complete reuse
   */
  this.reset = () => {
    publishedTableValue = {};
    loadingTableValue = {};
    idsAwaitingDataLoad = {};
    idsAwaitingDataLoadCount = 0;
    idsForWhichUpdatedDataIsAvailable = {};
    idsForWhichUpdatedDataIsAvailableCount = 0;
    idsToDisplay = [];
    publishedDisplay = [];
  }
  
  /**
   * Adds an ID for which data should be loaded once and then never again.
   * @param {*} id - the ID to add resource tracking for
   */
  this.addIdOfResourceToAddToFreezeState = (id) => {
    if(!idsAwaitingDataLoad[id] && !publishedTableValue[id] && !loadingTableValue[id]) {
      idsAwaitingDataLoad[id] = true;
      idsAwaitingDataLoadCount += 1;
    }
  }

  /**
   * Adds a set of IDs to display in the order they should be displayed.
   * Ids added to the display will also be added to the collection of ids
   * for which data should be loaded once and then never again.
   * @param {*} id - the ID to add resource tracking for
   */
  this.setIdsToDisplay = (ids) => {
    if(idsToDisplay !== ids) {
      // Set the ids to display
      idsToDisplay = ids;

      // Reset the ids waiting to be loaded
      idsAwaitingDataLoad = {};
      idsAwaitingDataLoadCount = 0;

      if(ids.length === 0) {
        updatePublishedDisplay();
      } else {
        // Make sure we mark them as waiting for data if we
        // don't already have it
        forEach(ids , id => {
          this.addIdOfResourceToAddToFreezeState(id)
        });

        this.loadMissingDataFrom({});
      }
    }
  }
  
  // Pulls data out of a redux state "table" and
  // adds it to the loading state for every ID that
  // has been requested.
  this.loadMissingDataFrom = (stateTable) => {
    if(idsAwaitingDataLoadCount > 0) {
      forEach(stateTable, resource => {
        if(
          /**
           * If this resource is marked as once that we are waiting for,
           * load it, and then remove the marker indicating we are waiting
           * for it.
           */
          idsAwaitingDataLoad[resource.id] === true
        ) {
          loadingTableValue[resource.id] = resource;
          delete idsAwaitingDataLoad[resource.id];
          idsAwaitingDataLoadCount -= 1;
        } else if(
          /**
           * Detect updates to the frozen data and track which items, and how many have updates
           */
          (
            (publishedTableValue[resource.id] && publishedTableValue[resource.id] !== resource)
             || (loadingTableValue[resource.id] && loadingTableValue[resource.id] !== resource)
          )
          && !idsForWhichUpdatedDataIsAvailable[resource.id]
        ) {
          idsForWhichUpdatedDataIsAvailable[resource.id] = true;
          idsForWhichUpdatedDataIsAvailableCount += 1;
        }
      });

    }
    
    if(idsAwaitingDataLoadCount === 0) {
      updatePublishedDisplay();
    }
  }

  /**
   * Updates a frozen resource with a new value.
   */
  this.updateFrozenResourceData = (resources) => {
    forEach(resources, resource => {
      loadingTableValue[resource.id] = resource;
    });
    updatePublishedDisplay({ force: true });
  }
}

export default FreezingStateTableWithPartialLoading;
