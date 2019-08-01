export default class DashboardState {
  
  /**
   * The ID of the loop this dashboard is for
   */
  loopId;

  /**
   * The date of the oldest post loaded for display on this dashboard
   */
  displayedPostsEndDate;

  /**
   * Indicates the ID of the category results have been limited to. 
   * If undefined, the displayedPostReferences have not been filtered 
   * by category
   */
  categoryIdFilter;

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
   * Collection of strings each representing an error to display to the user
   */
  errors = [];

  constructor(loopId) {
    if(!loopId) throw new Error('ERROR: loopId is required');

    this.loopId = loopId;
  }
}