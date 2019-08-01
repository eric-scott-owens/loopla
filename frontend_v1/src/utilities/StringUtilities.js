// <summary>
// Creates an StringBuilder object for high performance 
// string concatenation.
// </Summary
export function StringBuilder(starterString) {
  let buffer = [];
  if(starterString) buffer.push(starterString);

  // <summary>
  // Append a string to the end of the string being built
  // </summary>
  this.append = function append(str) {
    buffer.push(str);
  }

  // <summary>
  // Prepends a string to the beginning of the string being built
  // </summary>
  this.prepend = function prepend(str) {
    buffer.unshift(str);
  }

  // <summary>
  // Clears the contents of the string builder
  // </summary>
  this.clear = function clear() {
    buffer = [];
  }

  // <summary>
  // Returns the concatenated string built by the builder
  // </summary>
  this.toString = function toString(separator) {
    return buffer.join(separator || '');
  }
};

// <summary>
// Returns true if the provided string is null or composed of only white space
// </summary>
export function isNullOrWhitespace(input) {
  if (typeof input === 'undefined' || input == null) return true;
  return input.replace(/\s/g, '').length < 1;
}

/**
 * Escapes RegEx characters so they can be safely searched for in replaceAll
 */
 export function escapeRegExp(str) {
  return str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
}

/**
 * Returns a new string in which all instances of a substring, if found, 
 * are removed from the original string
 * @param {*} str
 * @param {*} find 
 * @param {*} replace 
 */
export function replaceAll(str, find, replace) {
  return str.replace(new RegExp(escapeRegExp(find), 'g'), replace);
}

export function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function lowerCaseFirstLetter(string) {
  return string.charAt(0).toLowerCase() + string.slice(1);
}

export function formatPersonName(firstName, middleName, lastName) {
  const nameBuilder = new StringBuilder();
  nameBuilder.append(firstName)
  if(middleName) nameBuilder.append(` ${middleName}`);
  if(lastName) nameBuilder.append(` ${lastName}`);
  const displayName = nameBuilder.toString();
  return displayName;
}

/**
 * Returns true if the provided string only includes characters
 * included in the specified allowedCharacters.
 * @param {string} str
 * @param {array[char]} allowedCharacters
 * @returns {boolean} 
 */
export function onlyUses(str, allowedCharacters) {
  const dictionary = {};
  const strLength = str.length;
  const allowedCharactersLength = allowedCharacters.length;
  let i;
  
  // index allowed characters
  for(i = 0; i < allowedCharactersLength; i+= 1) {
    dictionary[allowedCharacters[i]] = true
  }
  
  // Determine if the provided string only uses allowed characters
  let result = true; // Assume no problem... until there is
  for(i = 0; i < strLength; i+= 1) {
    if(!dictionary[str.charAt(i)]) {
      // This character is not allowed
      result = false;
      break;
    }
  }

  return result;
}

export function padEnd(string, targetLength, padString) {
  let pad = String((typeof padString !== 'undefined' ? padString : ' '));
  if (string.length >= targetLength) {
      return string;
  }

  const padLength = targetLength - string.length;
  if (padLength > pad.length) {
      pad += pad.repeat(padLength/pad.length); // append to original to ensure we are longer than needed
  }
  return `${string}${pad.slice(0,padLength)}`;
};