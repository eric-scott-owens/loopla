
export const TOUR_STEP_INDICES = {
  LOOP_PAGE: 0,
  POST_PREVIEWS: 1,
  LOOP_TAGS: 2,
  NEW_POST: 3,
  LEARN_MORE: 4
};

export default {
  steps: [
    {
      target: '.o-loop-dropdown',
      title: 'Loop Page',
      content: "Only people who belong to this loop, including you, can see this page and its content. If you are a member of more than one loop, you can switch to another loop here.",
      disableBeacon: true,
      disableOverlay: false
    },
    {
      target: '.o-post-preview-list',
      title: 'Post Previews',
      content: "The most recently updated posts are at the top. Click on any preview to see the full post or add a comment.",
      disableBeacon: true,
      disableOverlay: false,
      placement: 'right-start'
    },
    {
      target: '.o-loop-tags',
      title: 'Popular Tags',
      content: "The most frequently used tags in this loop are shown here. (If you don't see any now, make some posts and check again.) Click on them to see related posts.",
      disableBeacon: true,
    },
    {
      target: '.o-tour-hack-create-post',
      title: 'Create a New Post',
      content: '', // content: 'Click here to make a new post',
      disableBeacon: true,
    },
    {
      target: '.bm-burger-button',
      title: 'Learn More',
      content: 'To see this tour again or learn more about Loopla, click the question mark.',
      disableBeacon: true,
    },
  ]
}
