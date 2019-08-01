import React from 'react';
import PageInitializer from '../../PageInitializer';
import Page from '../../Page';
import PageFullWidthSection from '../../../components/PageFullWidthSection';
import BasicButton from '../../../components/BasicButton';
import configuration from '../../../configuration';

import "./CareersPage.scss";

const CareersPage = () => (
  <PageInitializer>
    <Page className="o-public-page o-careers-page">
      <div className="text-center" id="careersTop">
        <img src={`${configuration.SITE_RESOURCES_URL}/frontend_v1/media/monsters/loopla_monster_friends.png`} alt="monsters" height="150" width="232" data-pin-nopin="true" />
        <h1>Careers at Loopla</h1>
        {/* <h2>Add date here</h2> */}
        <h6 className="text-center o-toc">
          <a href="#careersSE">Software Engineer (all levels)</a>
          <br /><a href="#careersUX">User Experience (UX) Designer</a>
          {/*  
          <br /><a href="#careersSEI">Software Engineering Intern</a>
          <br /><a href="#careersURI">User Researcher / User Experience Intern</a>
          <br /><a href="#careersUII">User Interface / Visual Design Intern</a>
          */}
          <br /><a href="#careersOTHER">Other Roles</a>
        </h6>
      </div>

      <PageFullWidthSection>
        <h3>About Loopla</h3>
        <p>Loopla is a way for people to solve life together. Loops are the foundation of Loopla. A loop is a closed, private group of friends who share questions and information about everyday life.</p>
        <p>Loops may discuss anything of interest to their members. Topics may include anything from finding a talented hair stylist or a reliable auto repair shop, planning a camping trip or giving away clothes that no longer fit.</p>
        <p>Loopla is designed to be the <b>helpful social network</b> where friends assist each other in small ways. Loopla seeks to create a healthy online environment that brings out the best in people, building deeper relationships and stronger communities.</p>
        <p>Loopla is based on user privacy and is not an advertising platform. We will not show you ads and we will not sell or share your data with third parties. Loopla is free and seeks to be sustainable through donations from our users.</p>
        <h3>Working at Loopla</h3>
        <p>Loopla, a Pittsburgh-based startup company founded by <a href="https://www.linkedin.com/in/henry-schneiderman-1345498/">Henry Schneiderman</a> and <a href="https://www.linkedin.com/in/annelopezz/">Anne Lopez</a>, is seeking candidates to join our small and passionate team. We encourage open discussion, experimentation and kindness within a casual work environment. Team members have a great deal of autonomy and the opportunity to contribute to many aspects of the business.</p>
        <p>As a part of the Loopla team, you’ll be working to build technology that strengthens groups through meaningful interactions while delivering delightful user experiences.</p>
        <b>Technology</b>
        <p>Our current technology stack includes React, Redux, Python, Django (backend only), Postgresql, HTML, CSS, Bootstrap, Javascript, and jQuery as well as Heroku and AWS.</p>
        <b>Office</b>
        <p>We are located in the heart of the East Liberty neighborhood, in close proximity to other startup companies and within walking distance of Google, Duolingo, AlphaLab and AlphaLab Gear and surrounded by a variety of restaurants, coffee shops and a vibrant nightlife. East Liberty is a diverse neighborhood, offering many housing options, including single family homes, condos, and apartments. A number of other very livable neighborhoods are within walking distance or a short bike ride, including Shadyside, Squirrel Hill, Bloomfield, Highland Park, and Garfield.</p>
        <p><b>Benefits for full-time employees</b>
          <ul>
            <li>Market-rate salaries</li>
            <li>Excellent benefits</li>
            <li>Opportunity to influence product and company from the ground up</li>
            <li>Equity</li>
            <li>Paid time off</li>
            <li>Medical, dental and vision insurance</li>
          </ul>
        </p>
        
        <b>Loopla is an equal opportunity employer. We are committed to building an inclusive environment for all employees.</b>
        <br /><br />Recruiters, please do not contact us.
      </PageFullWidthSection>

      <div className="o-section" id="careersSE">
        <h3>Software Engineer (all levels)</h3>
        <p>You are a versatile software developer who is motivated by Loopla’s mission and passionate about creating a product that will delight users. You’ll work with a small dynamic team with expertise in design, full-stack development, user research, and machine leaarning. You will have broad involvement with many aspects of product development.</p>
        <b>Goals</b>
        <br />As a company, we strive to build a technology that is intuitive, flexible, scalable, and consistent across platforms. As a member of our engineering team, you will work toward the following goals:
        <ul>
          <li>Create a product that users intuitively grasp</li>
          <li>Develop software that is maintainable and adaptable to changes in design</li>
          <li>Develop consistency in look, feel, and behavior across common devices and platforms</li>
          <li>Develop a platform that can smoothly accommodate rapid growth in usage and content</li>
        </ul>
        <b>Skills Required</b>
        <ul>
          <li>A solid foundation in computer science with strong competencies in data structures, algorithms, software design, and software engineering.</li>
          <li>Experience with a modern programming language (e.g., Javascript, Python, Java, C++)</li>
          <li>Good judgment in allocating time and resources. Understanding when to move quickly, for example, to test experimental ideas, and when to devote greater effort to engineer stable components of the product</li>
          <li>Initiative to learn and apply new concepts and new technologies</li>
          <li>Clear, direct, yet polite written and verbal communication skills. Back up opinions and arguments with specific data or relevant information and concepts. Be open-minded and examine other points of view</li>
        </ul>
        <b>Expectations</b>
        <ul>
          <li>Experienced with or excited to learn React & Redux, natural language technologies, Javascript, database design & Postgresql</li>
          <li>Treat others with respect and kindness</li>
          <li>Willingness to learn and grow both professionally and personally</li>
          <li>Local to Pittsburgh area or willingness to relocate</li>
        </ul>  
        <BasicButton color="primary" size="sm" href="https://goo.gl/forms/JTxoivBXaOVRnoPH3" target="_blank">Apply Here</BasicButton>
      </div>

      <div className="o-section" id="careersUX">
        <h3>User Experience (UX) Designer</h3>
        <p>You are a versatile user experience (UX) designer who is excited to make a product that will help and delight users. You'll work with a team of startup veterans with expertise in design, full-stack development, user research, and machine learning. UX designer will have broad involvement with many aspects of product development.</p>
        <b>Key challenges</b>
        <ul>
          <li>User Centered Design - Creating a product that meets users’ needs</li>
          <li>Clarity - Creating an experience that users intuitively grasp</li>
          <li>Delightfulness - Creating an experience that is pleasing and fun</li>
          <li>Helpfulness - Creating an experience that encourages helpful behavior</li>
        </ul>
        <b>Responsibilities</b>
        <ul>
          <li>Design and refine Loopla's user interface in support of our goal of becoming the "helpful social platform"</li>
          <li>Work in short design cycles to improve user interface incorporating user research findings</li>
          <li>Participate in user research</li>
          <li>Work closely with the development team to incorporate design revisions into the development cycle</li>
        </ul>
        <b>Desired background and skills</b>
        <ul>
          <li>Broad knowledge and experience in user-centered design</li>
          <li>Broad knowledge of state-of-the-art user experience and user interface design</li>
          <li>Ability to efficiently create low-fidelity UI sketches and mockups</li>
          <li>Ability to create high-fidelity UI prototypes (Using HTML and CSS. Knowledge of Javascript, React and other front-end platforms are a bonus but not necessary)</li>
        </ul>  
        <b>Expectations</b>
        <ul>
          <li>Treat others with respect and kindness</li>
          <li>Willingness to learn and grow both professionally and personally</li>
          <li>Local to Pittsburgh area or willingness to relocate</li>
        </ul>  
        <BasicButton color="primary" size="sm" href="https://goo.gl/forms/JTxoivBXaOVRnoPH3" target="_blank">Apply Here</BasicButton>
      </div>



      {/* 
      <div className="o-section" id="careersSEI">
        <h3>Software Engineering Intern</h3>
        <p>Loopla is looking for interns to work as part of our team for the summer of 2019. Interns will have the opportunity to work on a variety of features involving front-end, back-end, and/or full-stack development. Interns will work with Loopla’s team which includes expertise in software engineering, design, and user research and will enjoy broad exposure to many aspects of company operations. The internship will be a great opportunity to contribute to a new and exciting social platform while learning many new things in a supportive work environment.</p>
        <b>What we are looking for:</b>
        <p>Candidates majoring in computer science or a related field with strong desire to learn new skills and build a great product that delights users.</p>
        <BasicButton color="primary" size="sm" href="https://goo.gl/forms/6T5cfOU3v7PmTgSi2" target="_blank">Apply Here</BasicButton>
      </div>

      <div className="o-section" id="careersURI">
        <h3>User Researcher / User Experience Intern</h3>
        <p>Loopla is looking for interns to work as part of our team for the summer of 2019. Interns will engage in various aspects of user research including user outreach, user experience design, and user testing. Interns will work with Loopla’s team which includes expertise in user research, design, and software engineering and will enjoy br /oad exposure to many aspects of company operations. The internship will be a great opportunity to contribute to a new and exciting social platform while learning many new things in a supportive work environment.</p>

        <b>What we are looking for:</b>
        <p>Candidates majoring in human-computer interaction, computer science, psychology or a related field with strong desire to learn new skills and build a great product that delights users.</p>
        <BasicButton color="primary" size="sm" href="https://goo.gl/forms/6T5cfOU3v7PmTgSi2" target="_blank">Apply Here</BasicButton>
      </div>

      <div className="o-section" id="careersUII">
        <h3>User Interface / Visual Design Intern</h3>
        <p>Loopla is looking for interns to work as part of our team for the summer of 2019. Interns will engage in various aspects of user experience design including interaction design and visual design. Interns will work with Loopla’s team which includes expertise in design, user research, and software engineering and will enjoy broad exposure to many aspects of company operations.  The internship will be a great opportunity to contribute to a new and exciting social platform while learning many new things in a supportive work environment.</p>
        <b>What we are looking for:</b>
        <p>Candidates with a background in human-computer interaction and visual design with strong desire to learn new skills and build a great product that delights users.</p>
        <BasicButton color="primary" size="sm" href="https://goo.gl/forms/6T5cfOU3v7PmTgSi2" target="_blank">Apply Here</BasicButton>
      </div> 
      */}

      <div className="o-section" id="careersOTHER">
        <h3>Other Roles</h3>
        <p>Don't see what you are looking for? We are always on the lookout for people who are inspired by Loopla’s mission and who can contribute in unique and impactful ways. Send us your resume with a cover letter elaborating on why you would like to work at Loopla.</p>
        <BasicButton color="primary" size="sm" href="https://goo.gl/forms/JTxoivBXaOVRnoPH3" target="_blank">Apply Here</BasicButton>
      </div>

      <div className="o-section-no-line">
        <a href="#careersTop">Back to top</a>
      </div>
    </Page>
  </PageInitializer>
);

export default CareersPage;
