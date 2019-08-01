import get from 'lodash/get';

const DEPLOYMENT_ENVIRONMENTS = {
  development: 'DEVELOPMENT_DEPLOYMENT_ENVIRONMENT',
  staging: 'STAGING_DEPLOYMENT_ENVIRONMENT',
  production: 'PRODUCTION_DEPLOYMENT_ENVIRONMENT',

  appDevelopment: 'APP_DEVELOPMENT_DEPLOYMENT_ENVIRONMENT',
  appStaging: 'APP_STAGING_DEPLOYMENT_ENVIRONMENT',
  appProduction: 'APP_PRODUCTION_DEPLOYMENT_ENVIRONMENT',
}

const CURRENT_DEPLOYMENT_ENVIRONMENT = `${get(window, 'Loopla.config.DEPLOYMENT_ENVIRONMENT')}_DEPLOYMENT_ENVIRONMENT`;

function getRootServerUrl() {
  if(CURRENT_DEPLOYMENT_ENVIRONMENT === DEPLOYMENT_ENVIRONMENTS.appProduction) {
    return 'https://www.loopla.com'
  }

  return '';
}
const rootServerUrl = getRootServerUrl();

const configuration = {
  ROOT_SERVER_URL: rootServerUrl,
  APP_ROOT_URL: '',
  APP_SEARCH_URL: `/search`,
  API_ROOT_URL: `${rootServerUrl}/api_v1`,
  API_SEARCH_URL: `${rootServerUrl}/api_v1/search`,
  TELEMETRY_ROOT_URL: `${rootServerUrl}/api_v1/telemetry`,
  DEPLOYMENT_ENVIRONMENTS,
  CURRENT_DEPLOYMENT_ENVIRONMENT,
  SITE_RESOURCES_URL: (get(window, 'Loopla.config.SITE_RESOURCES_URL')).replace(/\/\s*$/, ""),
  KUDOS_ENABLED: (get(window, 'Loopla.config.KUDOS_ENABLED')),
  KUDOS_STORE_ENABLED: (get(window, 'Loopla.config.KUDOS_STORE_ENABLED')),
  SOCKET_IO_SERVER_HOST: (get(window, 'Loopla.config.SOCKET_IO_SERVER_HOST')),
  SOCKET_IO_SERVER_PORT: (get(window, 'Loopla.config.SOCKET_IO_SERVER_PORT')),

  MODEL_TYPES: {
    post: 'Post',
    shortListItem: 'ShortList',
    place: 'Place',
    tag: 'Tag',
    comment: 'Comment',
    user: 'User',
    googlePlace: 'GooglePlace',
    token: 'Token',
    group: 'Group',
    membership: 'Membership',
    summaryPreference: 'SummaryPreferences',
    invitation: 'Invitation',
    multiUseInvitation: 'MultiUseInvitation',
    waitlist: 'Waitlist',
    feedback: 'Feedback',
    catalogItem: 'catalogItem',
    kudos: 'kudo',
    kudosGiven: 'KudosGiven',
    category: 'Category',
    categoryStatistics: 'CategoryStatistics'
  },

  RESOURCE_IS_STALE_LIMIT_SECONDS: 120,
  PLACES_MAX_CACHE_LIMIT_DAYS: 29,

  internalFieldNames: {
    DATE_FETCHED: '__date_fetched__',
    DEFAULT_KEY_GEN: '__default_key_gen__',
    NEW_CATEGORY_NAME: '__new_category_name__',
    NEW_TAG_NAME: '__new_tag_name__',
    NEW_PLACE_NAME: '__new_place_name__',
    VALUE_PATH: '__value_path__',
    IS_EDITING: '__is_editing__',
    SAFE_GROUP_NAME: '__safe_group_name__'
  },

  NEW_OBJECT_ID: 'NEW_OBJECT_ID',

  PAGE_SIZES: {
    postPreviews: 15,
    searchPreviews: 30
  },

  google: {
    PLACE_FIELDS: ['name', 'rating', 'formatted_phone_number', 'formatted_address', 'url', 'geometry', 'website'],
    DEFAULT_MAP_ZOOM: 13
  },

  scrollThrottle: {
    maxWait: 200 // ms
  },

  enableRichTextEditing: false,
  cuteInterjections: ['oops'],
  pathsToAvoid: ['/login/', '/forgot/', '/sent', '/reset'],
  RESTRICT_LOOP_CREATION: get(window, 'Loopla.config.RESTRICT_LOOP_CREATION', true),
  RESTRICT_LOOP_CREATION_ALLOWED_LOOPS: get(window, 'Loopla.config.RESTRICT_LOOP_CREATION_ALLOWED_LOOPS', []),
  MASTER_LOOP: 'IDENTIFIER:MODEL{Group}:ID{228}',
  POLLING_RATES_IN_SECONDS: {
    NEW_POST_DATA_RECEIVED: 5
  },
  
  INTEGRATIONS: {
    STRIPE: {
      PUBLIC_KEY: get(window, 'Loopla.config.STRIPE_PUBLIC_KEY')
    }
  }
}

export default configuration;