import React from 'react';
import PageInitializer from '../../PageInitializer';
import Page from '../../Page';
import configuration from '../../../configuration';

import "./AboutPage.scss";

const AboutPage = () => (
  <PageInitializer>
    <Page className="o-public-page o-about-page">
      <div className="text-center" id="aboutTop">
        {/* image visible on xs and sm devices */}
        <img className="d-md-none mx-auto mb-0" src={`${configuration.SITE_RESOURCES_URL}/frontend_v1/media/monsters/loopla_monster_octomonster_mobile.png`} alt="monster" height="auto" width="280" data-pin-nopin="true" />
        {/* image visible on md, lg, and xl devices */}
        <img className="d-none d-md-block mx-auto mb-0" src={`${configuration.SITE_RESOURCES_URL}/frontend_v1/media/monsters/loopla_monster_octomonster.png`} alt="monster" height="auto" width="400" data-pin-nopin="true" />
        <h1>Solve Life Together</h1>
      </div>

      <div className="o-section" id="aboutWhat">
        <h3>What is Loopla?</h3>
        <p>Loopla is a way for people to solve life together. Loops are the foundation of Loopla. A loop is a closed, private group of friends who share questions and information about everyday life.</p>
        <p>Loops may discuss anything of interest to their members. Topics may include anything from finding a talented hair stylist or a reliable auto repair shop, planning a camping trip or giving away clothes that no longer fit.</p>
      </div>

      <div className="o-section" id="aboutWhy">
        <h3>Why Loopla?</h3>
        <p>Loopla is designed to be the <b>helpful social network</b> where friends assist each other in small ways. Loopla seeks to create a healthy online environment that brings out the best in people, building deeper relationships and stronger communities.</p>
        <p>Loopla is based on user privacy and is not an advertising platform. We will not show you ads and we will not sell or share your data with third parties. Loopla is free and seeks to be sustainable through donations from our users.</p>
      </div>

      <div className="o-section" id="aboutGuidelines">
        <h3>Guidelines</h3>
        <h4>1. Be helpful</h4>
        <p>Make contributions that are of value to the members of your loops. Questions, recommendations, discoveries and DIY solutions make great additions.</p>
        <h4>2. Keep loops private</h4>
        <p>Loop members expect that their conversations remain private to the loop. {/* In other words, what is said inside a loop, stays inside that loop.*/} Please respect this confidentiality.</p>
        <h4>3. Keep a tight loop</h4>
        <p>Form loops around existing groups of people who already know each other in real life. In a tight loop, members can speak freely, trust each other's advice and engage in meaningful conversations. </p>
        <h4>4. Be nice</h4>
        <p>Treat your fellow loop members with respect and kindness.</p>
        <h4>5. Be transparent</h4>
        <p>State any real or perceived conflicts of interest. If you are recommending a great roofer who also happens to be your brother-in-law, just say so. And, if a business owner asks you to write them a recommendation, disclose that too.</p>
      </div>

      <div className="o-section" id="aboutFounders">
        <h3>Founders</h3>
          <p><a className="o-link-bold" href="https://www.linkedin.com/in/henry-schneiderman-1345498/" target="_blank">Henry Schneiderman</a>, Co-Founder & CEO</p>
          <p><a className="o-link-bold" href="https://www.linkedin.com/in/annelopezz/" target="_blank">Anne Lopez</a>, Co-Founder & COO</p>
      </div>   

      <div className="o-section-no-line">
        <a href="#aboutTop">Back to top</a>
      </div>
    </Page>
  </PageInitializer>
);

export default AboutPage;
