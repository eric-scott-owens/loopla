export default class UserState {
  
  /**
   * The ID of the loop this dashboard is for
   */
  userId;

  /**
   * The date of the oldest post loaded for display on this dashboard
   */
  displayedPostsEndDate;

  /**
   * Indicates whether or not additional data exists on the server
   * which is older that the oldest post references already being
   * displayed by this dashboard
   */
  postsOlderThanDisplayedPostsEndDataExist = true;

  /**
   * Post references ordered by the date they were last updated which should
   * be displayed on the dashboard once their data is loaded.
   */
  displayedPostReferences = [];

  /**
   * Client post objects currently being displayed on this dashboard
   */
  loadedData = {};

  /**
   * Collection of strings each representing an error to display to the user
   */
  errors = [];

  constructor(userId) {
    if(!userId) throw new Error('ERROR: userId is required');

    this.userId = userId;
  }
}