import camelCase from 'camelcase';
import decamelize from 'decamelize';
import forEach from 'lodash/forEach';
import values from 'lodash/values';
import moment from 'moment';
import { isNumber } from 'util';
import configuration from '../configuration';
import { StringBuilder, lowerCaseFirstLetter } from './StringUtilities';

/**
 * Checks the provided resource to see if it has gone stale in the local store
 * @param {*} resource 
 * @return {bool} true if the resource is stale else false
 */
export function isResourceStale(resource) {
  if (!resource) throw new Error('null reference error');

  // If no date fetched info exists then automatically
  // assume we need to refresh the data
  if (!resource[configuration.internalFieldNames.DATE_FETCHED]) return true;

  // If we do have a fetch date then return true or
  // false based on whether or not we have passed
  // the configured limit of seconds elapsed
  const now = moment();
  const diffSeconds = Math.abs(now.diff(resource[configuration.internalFieldNames.DATE_FETCHED], 'seconds'));
  return (diffSeconds > configuration.RESOURCE_IS_STALE_LIMIT_SECONDS);
}

export function shouldPlaceBePurgedFromCache(place) {
  if(!place) throw new Error('null reference error');

  if(!place[configuration.internalFieldNames.DATE_FETCHED]) return true;

  const now = moment();
  const diffDays = Math.abs(now.diff(place[configuration.internalFieldNames.DATE_FETCHED], 'days'));
  return (diffDays > configuration.PLACES_MAX_CACHE_LIMIT_DAYS);
}

// <summary>
// Used by convert.fromUnderScoredObject to determine when
// to query an property for child keys. If we should, it
// returns true
// </summary>
function doICareAboutChildKeysOf(property) {
  // Check if the property is an object type which requires
  // no further mapping
  return !(
    typeof property === 'string' 
    || typeof property === 'number'
    || typeof property === 'boolean'
    || typeof property === 'undefined'
    || Array.isArray(property) === true
    || Object.prototype.toString.call(property) === '[object Date]'
  )
};


export const IDENTIFIER_PREFIXES = {};

// <summary>
// Creates a unique key for the given database object
// </summary>
export function keyFor(thing) {
  if(!thing.model) throw new Error('Cannot create key for an object with no defined model type');
  
  if(keyFor[thing.model]) {
    return keyFor[thing.model](thing);
  }

  return keyFor[configuration.internalFieldNames.DEFAULT_KEY_GEN](thing)
}

/**
 * Initialize the identifier prefixes and keyFor specializations
 * */
// eslint-disable-next-line
(function(){
  // Build the default prefixes used in the system
  const identifier = 'IDENTIFIER';
  IDENTIFIER_PREFIXES.temp = `${identifier}:Temp`;

  const modelTypes = Object.keys(configuration.MODEL_TYPES);
  forEach(modelTypes, modelType => { 
    IDENTIFIER_PREFIXES[modelType] = `${identifier}:MODEL{${configuration.MODEL_TYPES[modelType]}}`;
  });

  // Build out the specialized keyFor methods
  keyFor[configuration.internalFieldNames.DEFAULT_KEY_GEN] = (thing) => `${identifier}:MODEL{${thing.model}}:ID{${thing.id}}`;
  keyFor.Post = (post) => `${IDENTIFIER_PREFIXES.post}:ID{${post.id}}`;
  keyFor.Comment = (comment) => `${IDENTIFIER_PREFIXES.comment}:ID{${comment.id}}`;
  keyFor.Group = (group) => `${IDENTIFIER_PREFIXES.group}:ID{${group.id}}`;
  keyFor.Membership = (membership) => `${IDENTIFIER_PREFIXES.membership}:ID{${membership.id}}`;
  keyFor.User = (user) => `${IDENTIFIER_PREFIXES.user}:ID{${user.id}}`;
  keyFor.Tag = (tag) => `${IDENTIFIER_PREFIXES.tag}:ID{${tag.id}}`;
  keyFor.Token = () => `${IDENTIFIER_PREFIXES.token}`;
  keyFor.Place = (place) => `${IDENTIFIER_PREFIXES.place}:ID{${place.id}}`;
  keyFor.GooglePlace = (place) => `${IDENTIFIER_PREFIXES.googlePlace}:ID{${place.id}}`;
  keyFor.Invitation = (invitation) => `${IDENTIFIER_PREFIXES.invitation}:ID{${invitation.id}}`;
  keyFor.Kudos = (kudos) => `${IDENTIFIER_PREFIXES.kudos}:ID{${kudos.id}}`;
  keyFor.KudosGiven = (kudosGiven) => `${IDENTIFIER_PREFIXES.kudosGiven}:ID{${kudosGiven.id}}`;

  // This is being used by editingObject > comments > stopEditingAll to identify 
  // comments in editing object
  keyFor.Comment.prefix = IDENTIFIER_PREFIXES.comment;
}());

export function newKeyFor(modelType, config) {
  if(!newKeyFor[modelType]) {
    newKeyFor[modelType] = `UNSAVED:MODEL{${modelType}}:ID{${configuration.NEW_OBJECT_ID}}`;
  }

  // If configuration values were provided, add them to the key
  if(config) {
    const keyBuilder = new StringBuilder();
    keyBuilder.append(newKeyFor[modelType]);

    const keys = (Object.keys(config)).sort(); // ensure key order
    forEach(keys, key => {
      keyBuilder.append(`:${key.toUpperCase()}{${config[key]}}`);
    })

    const key = keyBuilder.toString();
    return key;
  }

  return newKeyFor[modelType];
}

export function isKeyValid(key) {
  if(typeof key !== "string" ) return false;

  let isValidKey = true;
  const startIndex = key.indexOf(':ID{');
  if(startIndex < 0) isValidKey = false;

  const endIndex = key.indexOf('}', startIndex);
  if(endIndex < 0) isValidKey = false;

  return isValidKey;
}

// <summary>
// Takes a database object thing that has tags and user defined tags and returns
// a collection of keys for those tags. The returned collection is not de-duplicated
// and should not be as components use these duplicates to provide usage counts.
// </summary>
export function getTagKeysFrom(thing) {
  let tags = (thing.tags || []).slice(0);

  // Handle auto generated tags
  if(isNumber(tags[0])) {
    // Handle just database id being provided
    tags = tags.map(id => keyFor(Object.assign({ id, model:'Tag' })));
  } else {
    // Handle tag object
    tags = tags.map(t => keyFor(Object.assign(t)));
  }

  return tags;
}

/**
 * Returns and empty model for the specified model type
 * @param {string} modelType 
 */
export function getBlankModelFor(modelType, config) {
  switch(modelType) {
    case configuration.MODEL_TYPES.post: 
    {
      const blankPost = {
        model: configuration.MODEL_TYPES.post, 
        id: newKeyFor(configuration.MODEL_TYPES.post, config),
        summary:'', 
        text: '', 
        ownerId: '',
        group:null,
        comments: [],
        kudos: [],
        photoCollections: [{
          photoCollectionPhotos: []
        }],
        places: [],
        shortListEntries: [],
        tags: [],
        categoryIds: []
      };

      return { ...blankPost, ...config };
    }
    case configuration.MODEL_TYPES.comment:
    {
      const blankComment = {
        model: configuration.MODEL_TYPES.comment,
        id: newKeyFor(configuration.MODEL_TYPES.comment, config),
        postId: null,
        text: '',
        kudos: [],
        photoCollections: [{
          photoCollectionPhotos: []
        }],
        places: [],
        tags: [],
        categoryIds: []
      };

      return { ...blankComment, ...config };
    }
    case configuration.MODEL_TYPES.place:
    {
      const blankPlace = {
        model: configuration.MODEL_TYPES.place,
        id: newKeyFor(configuration.MODEL_TYPES.place, config),
        isUserGenerated: true,
        name: null,
        googlePlaceId: null
      };

      return { ...blankPlace, ...config };
    }
    case configuration.MODEL_TYPES.tag:
    {
      const blankTag = {
        model: configuration.MODEL_TYPES.tag,
        id: newKeyFor(configuration.MODEL_TYPES.tag, config),
        isUserGenerated: true,
        name: ''
      };

      return { ...blankTag, ...config };
    }

    case configuration.MODEL_TYPES.feedback: 
    {
      const blankFeedback = {
        model: configuration.MODEL_TYPES.feedback, 
        id: newKeyFor(configuration.MODEL_TYPES.feedback, config),
        text:'', 
        ownerId: '',
        photoCollections: [{
          photoCollectionPhotos: []
        }],
      };

      return { ...blankFeedback, ...config };
    }

    default: return {};
  }
}

/**
 * Dictionary mapping from MODEL_TYPE string names to the name of the table associated with that model
 */
const MODEL_TABLE_NAMES = {}; 

/**
 * Dictionary mapping from the table name associated to a model to the MODEL_TYPE of that model
 */
const TABLE_MODEL_NAMES = {};

export function getTableNameForModelType(modelType) {
  // Skip processing if we can
  if(!MODEL_TABLE_NAMES[modelType]) {
    // Ensure the requested model type is valid
    const modelTypes = values(configuration.MODEL_TYPES);
    const isValidModelType = modelTypes.indexOf(modelType) >= 0;
    if(!isValidModelType) {
      throw new Error('Invalid model type');
    }

    // Generate table to model type mappings
    if(modelType.indexOf('Kudos') === 0) { 
      // kudos is uncountable, so we don't want to make it plural like other tables
      MODEL_TABLE_NAMES[modelType] = lowerCaseFirstLetter(modelType);
      TABLE_MODEL_NAMES[modelType] = lowerCaseFirstLetter(modelType);
    }
    else if(modelType === configuration.MODEL_TYPES.summaryPreference) {
      MODEL_TABLE_NAMES[modelType] = lowerCaseFirstLetter(modelType);
      TABLE_MODEL_NAMES[modelType] = lowerCaseFirstLetter(modelType);  
    }
    else {
      // Pluralize the table name
      const tableName = `${lowerCaseFirstLetter(modelType)}s`;
      MODEL_TABLE_NAMES[modelType] = tableName;
      TABLE_MODEL_NAMES[tableName] = modelType;
    }
  }
  
  return MODEL_TABLE_NAMES[modelType];
}

export function getTableNameFor(thing) {
  return getTableNameForModelType(thing.model);
}

export function getModelNameForTable(tableName) {
  if(!TABLE_MODEL_NAMES[tableName]) {

    // Generate table to model type mappings
    if(tableName.indexOf('Kudos') === 0) {
      // kudos is uncountable, so we don't want to make it plural like other tables
      TABLE_MODEL_NAMES[tableName] = tableName;
      MODEL_TABLE_NAMES[tableName] = tableName;
    } else {
      // hack of the s at the end and upper case the first letter
      const builder = new StringBuilder();
      builder.append(tableName.substring(0,1).toUpperCase());
      builder.append(tableName.substring(1, tableName.length -1));
      const modelType = builder.toString();
  
      // Ensure the model type is valid
      const modelTypes = values(configuration.MODEL_TYPES);
      const isValidModelType = modelTypes.indexOf(modelType) >= 0;
      if(!isValidModelType) {
        throw new Error('Invalid table name. Not model could be determined');
      }
  
      TABLE_MODEL_NAMES[tableName] = modelType;
      MODEL_TABLE_NAMES[modelType] = tableName;
    }


  }

  return TABLE_MODEL_NAMES[tableName];
}

export function isObjectNew(databaseObject) {
  // this checks if the new key prefix is used for the specified model
  const isNewObject = `${databaseObject.id}`.indexOf(newKeyFor(databaseObject.model)) === 0;
  return isNewObject;
}

export const mapObject = {
  fromServerDatabaseObject(dbObject) {
    const result = Object.assign({}, dbObject);
    result.key = keyFor(result); 
    
    if(dbObject.dateAdded) {
      result.dateAdded = moment(dbObject.dateAdded).toDate();
    }

    if(dbObject.dateModified) {
      result.dateModified = moment(dbObject.dateModified).toDate();
    }

    result[configuration.internalFieldNames.DATE_FETCHED] = new Date();
    return result;
  },

  fromClientDatabaseObject(clientObject) {
    const result = { ...clientObject };

    if(result.key) {
      delete result.key;
    }

    delete result.dateAdded;
    delete result.dateModified;
    delete result[configuration.internalFieldNames.DATE_FETCHED];

    result.modelType = clientObject.model;

    return result;
  },

  fromDeserializedClientObject(deserializedClientObject) {
    const result = {...deserializedClientObject};

    if(deserializedClientObject.dateAdded) {
      result.dateAdded = moment(deserializedClientObject.dateAdded).toDate();
    }

    if(deserializedClientObject.dateModified) {
      result.dateModified = moment(deserializedClientObject.dateModified).toDate();
    }

    if(deserializedClientObject[configuration.internalFieldNames.DATE_FETCHED]) {
      result[configuration.internalFieldNames.DATE_FETCHED] = moment(deserializedClientObject[configuration.internalFieldNames.DATE_FETCHED]).toDate();
    }

    return result;
  },

  // <summary>
  // Recursively parses a given object to map all properties
  // using underscores in property names to an object composed
  // of camel cased property names
  // </Summary
  fromUnderScoredObject(thing) {
    // if it's null, just return it
    if(thing === null || thing === undefined) return thing;

    // If it's an object we need to map do it and return it!
    if (doICareAboutChildKeysOf(thing)) {
      const mappedThing = {};
      const keys = Object.keys(thing);

      forEach(keys, (key) => {
        const property = thing[key];
        const camelCasedKey = camelCase(key);
        mappedThing[camelCasedKey] = mapObject.fromUnderScoredObject(property);
      });
      
      return mappedThing;
    }
    
    // If it's an array return a collection of mapped objects
    if(thing.constructor === Array) {
      const mappedArray = [];
      forEach(thing, element => mappedArray.push(mapObject.fromUnderScoredObject(element)));
      return mappedArray;
    }

    // It's an object type we need to just return. Do it!
    return thing;
  },

  // <summary>
  // Recursively parses a given object to map all properties
  // using underscores in property names to an object composed
  // of camel cased property names
  // </Summary
  fromCamelCasedObject(thing) {
    // if it's null, just return it
    if(thing === null || thing === undefined) return thing;

    // If it's an object we need to map do it and return it!
    if (doICareAboutChildKeysOf(thing)) {
      const mappedThing = {};
      const keys = Object.keys(thing);

      forEach(keys, (key) => {
        const property = thing[key];
        const underScoredKey = decamelize(key);
        mappedThing[underScoredKey] = mapObject.fromCamelCasedObject(property);
      });
      
      return mappedThing;
    }
    
    // If it's an array return a collection of mapped objects
    if(thing.constructor === Array) {
      const mappedArray = [];
      forEach(thing, element => mappedArray.push(mapObject.fromCamelCasedObject(element)));
      return mappedArray;
    }

    // It's an object type we need to just return. Do it!
    return thing;
  }
}

