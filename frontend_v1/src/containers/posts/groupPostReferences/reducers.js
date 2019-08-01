import { handleActions } from 'redux-actions';

/**
 * Figures out where in the sorted array the new post reference should be
 * inserted to maintain an array ordered by postReference.newestUpdate DESC
 * @param {PostReference[]} postReferenceArray - the array to insert into
 * @param {PostReference} postReference - the post reference to be inserted
 * @returns {integer} - The index indicating where the post reference should be inserted
 */
function findInsertionIndex(postReferenceArray, postReference) {
  // Most data comes in fetched for newer or older display. 
  // So... start by checking the bookends
  let newestDate = new Date(1960,1,1)
  let oldestDate = new Date(1960,1,1)

  if(postReferenceArray.length > 0) {
    newestDate = postReferenceArray[0];
    oldestDate = postReferenceArray[postReferenceArray.length - 1]
  }

  if(postReference.newestUpdate >= newestDate) { return 0; } // Insert at the beginning
  if(postReference.newestUpdate <= oldestDate) { return postReferenceArray.length; } // Insert at the end

  // If we are still here we need to insert somewhere within the array. Find it.
  let searchStartIndex = 0;
  let searchEndIndex = postReferenceArray.length;
  let insertionIndex;
  while(insertionIndex === undefined) {

    if(searchEndIndex - searchStartIndex < 10) {
      // If we only have a few items to search... just iterate
      for(let i = searchStartIndex; i <= searchEndIndex; i += 1) {
        const otherPostReference = postReferenceArray[i];
        if(postReference.newestUpdate >= otherPostReference.newestUpdate) {
          insertionIndex = i;
          break;
        } 
      }
    } else {
      // We have a larger array... Lets knock down our size first
      const seekIndex = searchStartIndex + Math.ceil((searchEndIndex - searchStartIndex / 2));
      const otherPostReference = postReferenceArray[seekIndex];
      
      if(postReference.newestUpdate === otherPostReference.newestUpdate) {
        // Got lucky! Insert here... 
        insertionIndex = seekIndex;
      }
      else if(postReference.newestUpdate > otherPostReference.newestUpdate) {
        searchEndIndex = seekIndex;
      } 
      else if(postReference.newestUpdate < otherPostReference.newestUpdate) {
        searchStartIndex = seekIndex;
      }
    }
  }

  return insertionIndex;
}

/**
 * Adds a given post reference 
 * @param {*} state 
 * @param {*} post 
 * @param {*} groupId 
 */
export function process(state, postReference, groupId) {
  const updatedState = {...state};
  const groupPostReferences = (updatedState[groupId] || []).slice(0);
  const insertionIndex = findInsertionIndex(groupPostReferences, postReference);
  groupPostReferences.splice(insertionIndex, 0, postReference)
  updatedState[groupId] = groupPostReferences;
  return updatedState;
}

 /**
  * State Initializer :)
  * Used to track a collection of arrays of post references indicating
  * the order for which posts should be displayed in each loop.
  * 
  * Structure is a dictionary indexed by the id of each tracked group with
  * a value of an array of PostReference objects ordered by the display order
  * 
  * state[groupId] = (PostReference[])
  */
 export const reducers = handleActions(undefined, {})