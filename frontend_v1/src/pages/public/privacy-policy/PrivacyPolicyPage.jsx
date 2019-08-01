import React from 'react';
import PageInitializer from '../../PageInitializer';
import Page from '../../Page';
import configuration from '../../../configuration';
import FeedbackButton from '../../../components/FeedbackButton';

import "./PrivacyPolicyPage.scss";

const PrivacyPolicyPage = () => (
  <PageInitializer>
    <Page className="o-public-page o-privacy-policy-page">
      <div className="text-center" id="privacyPolicyTop">
        <img src={`${configuration.SITE_RESOURCES_URL}/frontend_v1/media/monsters/loopla_monster_friends.png`} alt="monsters" height="150" width="232" data-pin-nopin="true" />
        <h1>We don't share your personal information.</h1>
        <h2>This is our privacy policy.</h2>
      </div>
      
      <div className="o-section">
        <h3>Our mission</h3>
        <p>Our mission is to provide a platform where you can connect with people you know to share, discuss, and exchange useful information. Our goal is to serve you and your loops. Unlike other online platforms, we don't rely on or allow advertising. Instead we rely on the goodwill of users like you to support us and the Loopla community by purchasing and exchanging Kudos. This financial support allows us to continue to build and maintain this ecosystem without selling your data or allowing businesses to advertise to you on our platform. Thank you for supporting our mission and community.</p>
      </div>

      <div className="o-section">
        <h3>We don't share your information</h3>

        <p>Each Loopla member may belong to one or more loops. For each of these loops, only members of that loop can see that you are a member of the loop, view your posts and comments to that loop, view the short list entries you share with that loop, and view the profile information you choose to display to the loop.</p>

        <p>There is no advertising on Loopla and we don't share or sell data about your interests or activity (clicks, posts, etc.).</p>
      </div>

      <div className="o-section">
        <h3>Types of information we collect</h3>
        <h4>1. Information you give us</h4>
        <p>When you sign up for or use Loopla, you voluntarily give us certain information, such as:</p>
        <p><b>Account information.</b> This can include your name, profile photo, posts, comments, the email address or phone number you used to sign up, and any other information you provide us.</p>

        <p><b>Location data.</b> If you’re using Loopla on your mobile device, you can also choose to provide us with location data.</p>

        <p><b>Payment information.</b> If you use a credit card or other payment service, like PayPal, you provide your credit card number or other payment service information.</p>

        <p><b>Your contacts.</b> If you invite someone to a loop, you provide their name and email address. You also may give us permission to access your contacts. For example, you may link your Google account to Loopla for the purpose of accessing your contact list and their email addresses. However, we do not store or use this information other than to provide a convenient way for you to invite your own contacts to Loopla.</p>

        <h4>2. Technical information</h4>
        <p>Whenever you use a website, mobile application, or other internet service, technical information is created and recorded automatically, such as:</p>

        <p><b>Log data.</b> When you use Loopla, our servers automatically record information, including your Internet Protocol address, any web page links you clicked on, browser type and settings, the date and time of your activity, how you used Loopla, session data that includes your user login credentials, and cookie data.</p>

        <p><b>Cookie data.</b> Depending on how you’re accessing Loopla, we may use “cookies” (small text files sent by your computer each time you visit our website, unique to your Loopla account or your browser) or similar technologies to record log data. For example, we may use cookies to store your Loopla settings so you don‘t have to set them up every time you visit Loopla.</p>

        <p><b>Device information.</b> We may also collect information about the device you’re using Loopla on, including what type of device it is, what operating system you’re using, device settings, unique device identifiers, and crash data.</p>
      </div>


      <div className="o-section">
        <h3>How we use the information we collect</h3>

        <h4>To provide our product to you</h4>
        <p>All the personal, loop and post information you provide is stored so you can use it on our site. However, we don't share this information outside your loops.</p>

        <h4>To make our products better</h4>
        <p>We use the information we collect to make Loopla better and develop new features. For example, we may log how often people use two different features, which can help us understand which one is better.</p>

        <h4>To send you information about your loops</h4>
        <p>We send you notifications, newsletters, and other information that may be of interest to you. However, you are in control of your notification settings. You can decide whether or not to receive these updates or change the frequency of notifications by updating your account settings.</p>

        <h4>To help your friends and contacts find you on Loopla</h4>
        <p>We may allow people to search for your account on Loopla using your email address. To be discoverable, you may make your account visible to all Loopla users by updating your account settings.</p>
      </div>

      <div className="o-section">
        <h3>When we do disclose information</h3>

        <p><b>Payment processing.</b> If you use a credit card or payment service (like PayPal) to make a purchase on Loopla, we must share your transaction information (such as the payment amount, date, etc.) with the payment service in order to process the payment.</p>

        <p><b>Legal requests.</b> Like anyone else, we will comply with court ordered legal requests and disclose information to protect the safety of the public, or any person; or to detect, prevent, or otherwise address fraud or security threats. Loopla may transfer and store your information outside of your home country, including in the United States. The privacy protections and the rights of authorities to access your personal information in the U.S. may differ from those in your home country.</p>
      </div>


      <div className="o-section">
        <h3>You control your information</h3>
        <p>Access your account settings at any time to change your preferences.</p>

        <p>Close your account at any time. When you close your account, we’ll deactivate it and, if you desire, remove all your posts and comments from Loopla.</p>
      </div>

      <div className="o-section">
        <h3>Policy revisions</h3>

        <p>If this policy is significantly updated, we will update the text of this page and provide notice to you at http://www.loopla.com/ by writing '(Updated)' in red next to the Privacy Policy link for a period of at least 30 days. A list of revisions is maintained here:</p>
        
        <br />Jan 1 2018 - Version 1 created.
      </div>

      <div className="o-section">
        <h3>Questions and feedback</h3>
        <p className="margin-bottom-30">If you have questions or feedback, please contact us through the <FeedbackButton /> form.</p>

        <p>Effective January 1, 2018</p>
      </div>

      <div className="o-section-no-line">
        <a href="#privacyPolicyTop">Back to top</a>
      </div>

    </Page>
  </PageInitializer>
);

export default PrivacyPolicyPage;
