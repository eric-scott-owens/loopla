import React from 'react';
import { ListGroupItem } from 'reactstrap';
import { Link } from 'react-router-dom';
import Scrollspy from 'react-scrollspy';
import PageInitializer from '../../PageInitializer';
import Page from '../../Page';
import configuration from '../../../configuration';

import "./HowItWorksPage.scss";
import variables from "../../../_variables.scss";

const SCROLLSPY_ITEMS =
  [ 
    'loopla',
    'loops',
    'posts',
    'tags',
    'places',
    'search',
    'photos',
    'privacy',
    'user-profile',
    'user-settings',
    'flagging'
  ].map(item => `how-it-works-${item}`);

class HowItWorksPage extends React.Component {
  state = {
    pageTop: variables.pagetop
  }

  componentDidMount() {
    if (window.matchMedia) {
      this.mediaQuery = window.matchMedia('(min-width: 768px)');
      this.mediaQuery.addListener(this.setTop);
    }
  }

  componentWillUnmount() {
    if(this.mediaQuery) {
      this.mediaQuery.removeListener(this.setTop);
    }
  }

  setTop = isDesktop => {
    const pageTop = isDesktop ? variables.pagetop : variables.pagetopMobile;
    this.setState({ pageTop });
  }

  render() {
    const { SITE_RESOURCES_URL, APP_ROOT_URL } = configuration;
    return (
      <PageInitializer>
        <div className="o-how-it-works">

          {/* Scrollspy Nav for Medium devices and larger */}
          <Scrollspy items={ SCROLLSPY_ITEMS } className="how-it-works-nav list-group"
                    currentClassName="active" offset={ 0-parseInt(this.state.pageTop, 10) }>
            <ListGroupItem tag="a" className="" href="#how-it-works-loops">Loops</ListGroupItem>
            <ListGroupItem tag="a" className="" href="#how-it-works-posts">Conversations</ListGroupItem>
            <ListGroupItem tag="a" className="" href="#how-it-works-tags">Tags</ListGroupItem>
            <ListGroupItem tag="a" className="" href="#how-it-works-places">Places</ListGroupItem>
            <ListGroupItem tag="a" className="" href="#how-it-works-search">Search</ListGroupItem>
            <ListGroupItem tag="a" className="" href="#how-it-works-photos">Photos</ListGroupItem>
            <ListGroupItem tag="a" className="" href="#how-it-works-privacy">Privacy</ListGroupItem>      
            <ListGroupItem tag="a" className="" href="#how-it-works-user-profile">User Profile</ListGroupItem>
            <ListGroupItem tag="a" className="" href="#how-it-works-user-settings">User Settings</ListGroupItem>
            <ListGroupItem tag="a" className="" href="#how-it-works-flagging">Inappropriate Content</ListGroupItem>
          </Scrollspy>

          <Page className="o-public-page o-how-it-works-page" data-spy="scroll" data-target="#how-it-works-scrollspy" data-offset="0">
            <div id="how-it-works">
              <div id="top" />
              <h1>How It Works</h1>
            </div>

            {/* Table of Content for Mobile */}
            <div className="o-hiw-toc d-md-none">
              <div className="o-toc-link"><a className="" href="#how-it-works-loops">Loops</a></div>
              <div className="o-toc-link"><a className="" href="#how-it-works-posts">Conversations</a></div>
              <div className="o-toc-link"><a className="" href="#how-it-works-tags">Tags</a></div>
              <div className="o-toc-link"><a className="" href="#how-it-works-places">Places</a></div>
              <div className="o-toc-link"><a className="" href="#how-it-works-search">Search</a></div>
              <div className="o-toc-link"><a className="" href="#how-it-works-photos">Photos</a></div>
              <div className="o-toc-link"><a className="" href="#how-it-works-privacy">Privacy</a></div> 
              <div className="o-toc-link"><a className="" href="#how-it-works-user-profile">User Profile</a></div>
              <div className="o-toc-link"><a className="" href="#how-it-works-user-settings">User Settings</a></div>
              <div className="o-toc-link"><a className="" href="#how-it-works-flagging">Inappropriate Content</a></div>
            </div>

            <div className="o-section" id="how-it-works-loops">
              <h3>Loops</h3>
              <p>Loopla allows you to share information within private loops.</p>
              <p><b>What is a loop?</b>
              <br />A loop is a group of people who already know one another, such as a group of friends from high school, co-workers, exercise buddies, neighbors or parents.</p>

              <p><b>Loop page</b>
              <br />Each loop has its own page viewable only to its members as shown below for a loop called the "Loopla Founders Club".
    
              <br />&#8226; Change loops by clicking on the loop name, e.g, "Loopla Founders Club". 
              <br />&#8226; Conversation summaries are shown below the description of the loop and the list of loop members e.g., "Avoid parking under the light poles".
              <br />

              <img src={`${SITE_RESOURCES_URL}/frontend_v1/media/how-it-works/HIW_loop_page_v2.png`} alt="screenshot" height="auto" width="150" data-pin-nopin="true" />

              <br />&#8226;Click on a summary to see the full conversation:</p>
            
              <img src={`${SITE_RESOURCES_URL}/frontend_v1/media/how-it-works/HIW_loop_page_3.png`} alt="screenshot" height="auto" width="150" data-pin-nopin="true" />
              &nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;
              <img src={`${SITE_RESOURCES_URL}/frontend_v1/media/how-it-works/HIW_full_conversation.png`} alt="screenshot" height="auto" width="150" data-pin-nopin="true" />
          

              {/*********** Insert video here ****************** */}
              
              { /*<img src={`${SITE_RESOURCES_URL}/frontend_v1/media/how-it-works/HIW_loop_page.png`} alt="screenshot" height="auto" width="500" data-pin-nopin="true" />
              <p className="o-img-caption">Loop description: Click "33 members" or "+" to see a list of all members</p>

              <p>If there are more members than fit into this space, click the "+" to see all members. Alternatively, click on "33 members" to see a list of members' full names. Clicking on the photo or avatar of a member will show that member's profile page.</p>
              
              <img src={`${SITE_RESOURCES_URL}/frontend_v1/media/how-it-works/HIW_loop_page2.png`} alt="screenshot" height="auto" width="461" data-pin-nopin="true" />
              <p className="o-img-caption"></p> */}
              
              <p><b>Loop organizers</b>
              <br />Loop organizers can invite others to join their loop, remove members, and invite others to become fellow organizers. They can also edit the description of the loop. Each loop can have one or more organizers.</p>
              {/* <p>To see who the organizers in your loop are, view the membership list (see above), which will indicate the organizers.</p> */}
              
              <p><b>Becoming a loop organizer</b>
              <br />The creator of a loop automatically becomes an organizer of that loop. This organizer can immediately invite others to become organizers, whether or not they are already loop members. In general, once someone becomes an organizer they can invite others to become organizers.</p>
              
              <p><b>Becoming a loop member</b>
              <br />You may only join a loop by invitation. Only loop organizers can invite people to join the loop. Currently, invitations arrive by email.</p>

              <p><b>Creating a new loop (Coming Soon)</b>
              <br />Click "create a new loop" from your menu. You must already belong to a loop before you may create a new loop.</p>

              <p><b>Can anyone invite new members to the loop?</b>
              <br />No. Only loop organizers can invite people to join the loop. We do this so that loops will stay reasonably sized with people who know each other. If you want to add a new person to the loop, ask your loop organizers to invite them. {/*The loop organizers are indicated in the member list.*/}</p>

              <p><b>How many people can join a loop?</b>
              <br />Right now, loops are capped at 150 people. If you would like to invite more than 150 people, you may submit a request to us.</p>
            </div>

            <div className="o-back-to-top"><a className="text-right" href="#top">Back to top</a></div>

            <div className="o-section" id="how-it-works-posts">
              <h3>Conversations</h3>
              <p>Loop members communicate through conversations.</p>

              <p><b>Conversation topics</b>
              <br />You may ask questions, answer questions and share useful information through these conversations. We encourage discussion around everyday topics such as finding a talented hair stylist, a reliable auto repair shop, or a good place to view 4th of July fireworks. Loop members may organize a camping trip, plan a potluck or share recipes. Discuss anything of interest within a loop.</p>

              <p><b>Who can see our conversations?</b>
              <br />All conversations are 100% private to each loop. When you make a post, you must chose a specific loop to make that post in.  Only these members will be able to see and respond to your post. Any comments to that post will be visible only to that loop.</p>

              <p><b>Conversation summaries?</b>
              <br />Summaries of each conversation appear on the loop's page. {/*Below is a summary of a conversation about headphones.*/}</p>

              {/*<img src={`${SITE_RESOURCES_URL}/frontend_v1/media/how-it-works/HIW_post_preview.png`} alt="screenshot" height="auto" width="500" data-pin-nopin="true" />
              <p className="o-img-caption"></p> */}

              <p>Conversation summaries are shown in chronological order. Note that because comments are used to determine conversation order, an old conversation may jump to the top of the page if someone has recently commented on it.</p>

              <p><b>Viewing a full conversation</b>
              <br />You may click on each summary to see the entire conversation.</p>

              {/*********** Insert video here ****************** */}

              {/* <img src={`${SITE_RESOURCES_URL}/frontend_v1/media/how-it-works/HIW_post.png`} alt="screenshot" height="auto" width="500" data-pin-nopin="true" />
              <p className="o-img-caption"></p> */}

              <p><b>Commenting in an on-going conversation</b>
              <br />To participate in an on-going conversation, enter your comment in the "comment" box at the bottom of the full conversation.</p>

              {/*********** Insert video here ****************** */}

              <img src={`${SITE_RESOURCES_URL}/frontend_v1/media/how-it-works/HIW_comment_box.png`} alt="screenshot" height="auto" width="250" data-pin-nopin="true" />
            

              <p><b>Starting a new conversation</b>
              <br />To start a new conversation, users may create a post by clicking on the "+" button.</p>

              {/*********** Insert video here ****************** */}

              {/* <img src={`${SITE_RESOURCES_URL}/frontend_v1/media/how-it-works/HIW_post_button.png`} alt="screenshot" height="auto" width="193" data-pin-nopin="true" />
              <p className="o-img-caption"></p>

              <p>Doing so brings up the following form for submitting a post:</p>

              <img src={`${SITE_RESOURCES_URL}/frontend_v1/media/how-it-works/HIW_create_post.png`} alt="screenshot" height="auto" width="500" data-pin-nopin="true" />
              <p className="o-img-caption"></p>

              <p>You are required to give your post a title. The title should clearly indicate the topic of your post. Then type your post below. You also must specify which loop to send your post, through the loop selector button. The loop selector will default to the loop page you last visited (???).</p>

            <p>Tags, places, and photos (described below) are optional but very helpful in cataloging your post so that other will be able to find it if they ever have a similar question.</p> */}
            </div>

            <div className="o-back-to-top"><a className="text-right" href="#top">Back to top</a></div>

            <div className="o-section" id="how-it-works-tags">
              <h3>Tags</h3>
              <p>Tags are short labels that can be attached to any post or comment. They indicate a topic of discussion. Their purpose is to label and organize posts so they can be easily found by others at a later time — maybe even years after you make your post.</p>
              
              <p>Each conversation lists the tags assigned to it. The conversation below is tagged "Dermatologist" and "Medical Facilities & Services".</p>

              <img src={`${SITE_RESOURCES_URL}/frontend_v1/media/how-it-works/HIW_tags_in_post.png`} alt="screenshot" height="auto" width="250" data-pin-nopin="true" />
            
              <p><b>Tag page</b>
              <br />Tags provide a way to browse conversations by topic. Clicking a tag, e.g., "Medical Facilities & Services" above, will take you to its "tag page" showing all the conversations that contain that tag. It is meant to be a place where all information about a single topic is consolidated. A tag's page will also show all the "places" (see below) and tags that have been mentioned in these posts.</p>

              {/********* Will need video for this page after it is redesigned ***************/}

              {/*<img src={`${SITE_RESOURCES_URL}/frontend_v1/media/how-it-works/HIW_tags_page.png`} alt="screenshot" height="auto" width="500" data-pin-nopin="true" />
              <p className="o-img-caption"></p> */}

              {/* <p><b>Exploring by navigating from tag to tag</b>
              <br />Tags provide a way to explore by navigating from topic to topic. On many tag pages, there is a list of related tags. For example, on the "travel destinations" tag page, the user will have the option of navigating to related travel topics such as "air travel", "car rental", "hotels", etc. Related tags may also allow user to focus on a specific set of conversations. For example, under "travel destinations", there may be conversations about beaches, cruises, skiing , and other topics. Clicking on any of the more specific tags, e.g., "beaches", "cruises", and "mountain & ski resorts", will remove conversations about the other topics. (Coming soon)</p> */}

              {/* <p><b>What tags have been used in my loop?</b>
              <br />To see all the tags that have currently been used in your loop. . .</p> */}

              <p><b>Adding Tags to your posts and comments</b>
              <br />1) Loopla uses artificial intelligence to automatically add relevant tags to your contributions. Currently, Loopla assigns over 700 possible tags. However, since artificial intelligence is not real intelligence, these tags may occasionally miss the mark.  You may easily remove them for any reason. Some posts or comments, particularly shorter ones, may not generate any automatic tags.</p>

              <p>Automatic tags are added after you have typed your post or comment. Below "VETERINARIANS" and CATS" are added. Each can be removed by clicking the 'x'.</p>
              <img src={`${SITE_RESOURCES_URL}/frontend_v1/media/how-it-works/HIW_automatic_tags.png`} alt="screenshot" height="auto" width="250" data-pin-nopin="true" />       

              {/*********** Insert video here ****************** */}

              <p>2) You may also manually add tags to your posts and comments. These tags could provide a topic missed by the automatic tags or label more specific topics. Tags must consist of only letters or numbers and must be entered one at a time without spaces. Start typing your tag where it says "tags". Hit enter or return when you have completed a single tag. You may then repeat the process to add more. Soon Loopla will suggest tags that are already in use to try to avoid duplicate tags e.g, "car", "auto", "vehicle".</p>

              {/*********** Insert video here ****************** */}

              {/* <img src={`${SITE_RESOURCES_URL}/frontend_v1/media/how-it-works/HIW_adding_tags_2.png`} alt="screenshot" height="auto" width="500" data-pin-nopin="true" />
              <p className="o-img-caption">Enter each additional tag, e.g., "SAT", and hit return</p> */}
            </div>

            <div className="o-back-to-top"><a className="text-right" href="#top">Back to top</a></div>

            <div className="o-section" id="how-it-works-places">
              <h3>Places</h3>
              <p>You can add places to your posts also.  A ‘place' can be a business (e.g. Joe's Ice Cream Stand), destination (e.g., Central Park) or geographic location (e.g., East Liberty, Pittsburgh, PA).</p>

              {/*<img src={`${SITE_RESOURCES_URL}/frontend_v1/media/how-it-works/HIW_places.png`} alt="screenshot" height="auto" width="356" data-pin-nopin="true" />
              <p className="o-img-caption"></p> */}

              <p><b>Place page</b>
              <br />When you click on a place within a conversation, such as "VCA Fox Chapel" below, you will be taken that place's page. You'll see all the conversations that mention this place as well as helpful info about the place like its address and phone number, a map with the place's location.</p>

              <img src={`${SITE_RESOURCES_URL}/frontend_v1/media/how-it-works/HIW_location.png`} alt="screenshot" height="auto" width="250" data-pin-nopin="true" />
              <p className="o-img-caption"></p>

              <p><b>Adding a place to a post or comment</b>
              <br />To add a place, look for the thumbnail icon next to the camera. Click it and will open area, "Add relevant places here", in which to type the name of your place.</p>

              <img src={`${SITE_RESOURCES_URL}/frontend_v1/media/how-it-works/HIW_location_icon.png`} alt="screenshot" height="auto" width="250" data-pin-nopin="true" />
              &nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;
              <img src={`${SITE_RESOURCES_URL}/frontend_v1/media/how-it-works/HIW_location_input.png`} alt="screenshot" height="auto" width="250" data-pin-nopin="true" />

              <br /> Loopla will use Google's technology to help you select the full name of the place.<br />

              <img src={`${SITE_RESOURCES_URL}/frontend_v1/media/how-it-works/HIW_location_auto_complete.png`} alt="screenshot" height="auto" width="250" data-pin-nopin="true" />
              &nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;
              <img src={`${SITE_RESOURCES_URL}/frontend_v1/media/how-it-works/HIW_selected_location.png`} alt="screenshot" height="auto" width="250" data-pin-nopin="true" />

            {/* <p>The post will then display the selected place including its address:</p>

              <img src={`${SITE_RESOURCES_URL}/frontend_v1/media/how-it-works/HIW_adding_tags_2.png`} alt="screenshot" height="auto" width="500" data-pin-nopin="true" />
              <p className="o-img-caption"></p>*/}
            </div> 

            <div className="o-back-to-top"><a className="text-right" href="#top">Back to top</a></div>

            <div className="o-section" id="how-it-works-search">
              <h3>Search</h3>
              <p>Users may search across their loops for conversations or places by typing in the "search box" indicated with an icon of a magnifying glass on the top of every page in when viewed on a computer, or in the bottom toolbar on mobile devices. Hit "return", "enter", or click on the magnifying glass to retrieve search results. These results will show you conversations from your loops that contain your search term as well as places that are mentioned in those posts, and tags mentioned in those posts.  For example, a search for the phrase "veganism" may show posts about vegan restaurants and recipes, links to place pages for mentioned restaurants, and related tags that can be used to further explore the topic.</p>

              {/*<img src={`${SITE_RESOURCES_URL}/frontend_v1/media/how-it-works/HIW_search.png`} alt="screenshot" height="auto" width="500" data-pin-nopin="true" />
              <p className="o-img-caption"></p>*/}
            </div>

            <div className="o-back-to-top"><a className="text-right" href="#top">Back to top</a></div>

            <div className="o-section" id="how-it-works-photos">
              <h3>Photos</h3>
              <p>They say a picture is worth 1000 words. Photos can add a lot of information to a post. Add photos whenever you can. You may also include captions for each photo. Click on the camera icon to add a photo</p>
              
              <img src={`${SITE_RESOURCES_URL}/frontend_v1/media/how-it-works/HIW_add_photo.png`} alt="screenshot" height="auto" width="250" data-pin-nopin="true" />
          
              <img src={`${SITE_RESOURCES_URL}/frontend_v1/media/how-it-works/HIW_photo_added.png`} alt="screenshot" height="auto" width="250" data-pin-nopin="true" />
          
            </div>

            {/* <div className="o-section" id="how-it-works-lins">
              <h3>Links</h3>
              <p>When you share a link on Loopla, we will automatically bring in relevant photos from the link to illustrate the content.</p>
            </div> */}

            <div className="o-back-to-top"><a className="text-right" href="#top">Back to top</a></div>

            <div className="o-section" id="how-it-works-privacy">
              <h3>Privacy</h3>
              <p>Your posts and comments are private to the loop in which they are posted. They cannot be viewed by people who do not belong to that loop.</p>

              <p>We don't share your data outside Loopla. This includes everything you do on Loopla including your profile information, posts, comments, browsing activity, and clicks or other actions. Read our <Link to={`${APP_ROOT_URL}/privacy-policy/`}>Privacy Policy</Link>.</p>
            </div>

            <div className="o-back-to-top"><a className="text-right" href="#top">Back to top</a></div>

            <div className="o-section" id="how-it-works-user-profile">
              <h3>User Profile</h3>
              <p>Add or edit your profile photo, name, and contact information.</p>
            </div>

            <div className="o-back-to-top"><a className="text-right" href="#top">Back to top</a></div>

            <div className="o-section" id="how-it-works-user-settings">
              <h3>User Settings</h3>
              <p>Under user settings you can edit your notification preferences, change your password, and subscribe to email summary updates on the settings page on either a daily or weekly basis.</p>
              <p>Here you can also update your privacy settings by choosing which information you wish to share with your fellow loop members (email, phone number, and address).</p>
            </div>

            {/* <div className="o-section" id="how-it-works-kudos">
              <h3>Kudos</h3>
              <p>You may give kudos to other members to acknowledge helpful contributions. New users receive an initial allowance of kudos as a thank you for joining. Additional kudos may be purchased at any time.</p>
            </div>
            <div className="o-back-to-top"><a className="text-right" href="#top">Back to top</a></div> */}

            <div className="o-back-to-top"><a className="text-right" href="#top">Back to top</a></div>

            <div className="o-section" id="how-it-works-flagging">
              <h3>Inappropriate Content</h3>
              <p>If someone shares inappropriate content in your loop, we recommend that you attempt to handle it with a light touch. Sometimes people make mistakes without bad intentions. In particular, we recommend you first call the the author's attention to the matter by speaking to them directly. Otherwise, a reprimand in view of the full loop could escalate the situation into a public confrontation rather than a productive discussion. If the author did not mean to cause offense they will probably appreciate your discretion and be eager to revise the post. On the other hand, if the author is resistant to revising the post you have several alternatives, such as tagging the post with "reader beware" or something appropriate. or TBD</p>
            </div>

            <div className="o-back-to-top"><a className="text-right" href="#top">Back to top</a></div>
          </Page>
        </div>
      </PageInitializer>
    )
  } 
}

export default HowItWorksPage;