import configuration from '../configuration';

/**
 * Returns the in app URL for the given loop's dashboard
 * given it's associated group's key
 * @param {string} groupId - Unique identifier for the group
 * @returns {string} - URL to the specified loop's dashboard
 */
export function getLoopDashboardUrl(groupId) {
  return `${configuration.APP_ROOT_URL}/loop/${groupId}/dashboard`;
}

export function getLoopSettingsUrl(groupId) {
  return `${configuration.APP_ROOT_URL}/loop/${groupId}/settings`;
}

export function getUserProfileUrl(userId) {
  return `${configuration.APP_ROOT_URL}/users/${userId}`;
}

/**
 * Returns the root URL for the app
 * @returns {string} - URL to the root of the application
 */
export function getRootUrl() {
  return `${configuration.APP_ROOT_URL}/`;
}

