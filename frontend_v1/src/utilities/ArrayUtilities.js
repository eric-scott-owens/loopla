function defaultIdentityFunction(obj) { return JSON.stringify(obj); }

export const convert = {

  fromHash(hash) {
    return {
      // <summary> converts a hash index into an array</summary>
      toArray() {
        const results = [];
        if(!hash) return results;

        const keys = Object.keys(hash);
        for(let i = 0, iCount = keys.length; i < iCount; i += 1) {
          results.push(hash[keys[i]]);
        }
      
        return results;
      }
    }
  },

  fromArray(array) {
    return {
      // <summary>
      // Takes an array of objects (in which duplicates may appear) and 
      // returns and associative array hash index of objects indexed by
      // the provided identityFunction.
      // </summary>
      // <param name="array">
      // The array from which to create a reduced collection of objects
      // </param>
      // <param name="identityFunction">
      // Function used to identify unique objects and output and index. 
      // If not provided this is defaulted to compare the JSON 
      // representation of each array element.
      // </param>
      toHashIndex(identityFunction) {
        const identityFunc = identityFunction || defaultIdentityFunction;
        const hash = {};
        for(let i = 0, iCount = array.length; i < iCount; i += 1) {
          const identity = identityFunc(array[i]);
          if(!hash[identity]) {
            hash[identity] = array[i];
          }
        }
      
        return hash;
      },

      // <summary>
      // Takes an array of objects (in which duplicates may appear) and 
      // returns and associative array hash index of objects indexed by
      // the provided identityFunction as well as a count of how many times
      // each unique instance was found in the provided array.
      // </summary>
      // <param name="array">
      // The array from which to create a reduced collection of objects
      // </param>
      // <param name="identityFunction">
      // Function used to identify unique objects and output and index. 
      // If not provided this is defaulted to compare the JSON 
      // representation of each array element.
      // </param>
      // <returns>
      // Hash index of { property, count }
      // </returns>
      toHashIndexAndCountInstances(identityFunction) {
        const identityFunc = identityFunction || defaultIdentityFunction;
        
        const hash = {};
        for(let i = 0, iCount = array.length; i < iCount; i += 1) {
          const identity = identityFunc(array[i]);
          if(!hash[identity]) {
            hash[identity] = { 
              property: array[i],
              count: 1
            };
          }
          else {
            hash[identity].count += 1;
          }
        }

        return hash;
      }
    }
  }  
};

// <summary>
// Takes an array of objects in which duplicates may appear and returns
// a new array in which all elements are unique as identified by the 
// identityFunction.
// </summary>
// <param name="array">
// The array from which to create a reduced collection of objects
// </param>
// <param name="identityFunction">
// Function used to identify unique objects. If not provided this is 
// defaulted to compare the JSON representation of each array element.
// </param>
export function reduceToUnique(array, identityFunction) {
  const hash = convert.fromArray(array).toHashIndex(identityFunction);
  return convert.fromHash(hash).toArray();
}