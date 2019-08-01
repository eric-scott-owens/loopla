import React from 'react';
import DateFormatter from '../../../components/DateFormatter/DateFormatter';
import PageInitializer from '../../PageInitializer';
import Page from '../../Page';
import configuration from '../../../configuration';
import "../public-pages-style.scss";

import "./TermsOfServicePage.scss";


class TermsOfServicePage extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      currentDate: new Date(),
    }
  }

  render() {
    const { currentDate } = this.state;

    return (
      <PageInitializer>
        <Page className="o-public-page o-terms-of-service-page">
          <div className="text-center">
            <img src={`${configuration.SITE_RESOURCES_URL}/frontend_v1/media/monsters/loopla_monster_friends.png`} alt="monsters" height="150" width="226" data-pin-nopin="true" />
            <h1>Loopla Terms of Service</h1>
            <h2>
            <DateFormatter date={currentDate}/>
            </h2>
          </div>

          <div className="o-section-no-line">
            <p>This Terms of Service Agreement (“Agreement”) governs the disclosure of information by Loopla, Inc. (“Company”) to user (“Licensee”), and the Licensee's use of the Company’s beta service offering (“Service”).</p>
            <p>Licensee understands that Company owns Service including without limitation all intellectual property rights therein.</p>
            <p>Company grants Licensee non-exclusive, non-transferable license to use Company’s Service for a period of time designated by the Company for the purpose of testing and evaluating the Service ("Beta Test").</p>
            <p>This Service will be accessible only to Licensees who are invited to participate in the Beta Test. All information available about Service, except information that is publicly available or that can be obtained by visiting www.loopla.com without signing in, is considered confidential information (“Confidential Information”) of the Company. Licensee agrees not to disclose this Confidential Information to any third party other than other Licensees until the Service is released to the public. However, Licensee may disclose the Confidential Information if required to comply with a court order or other government demand that has the force of law.</p>
            <p>Service is prerelease software and is not at the level of performance of a publicly available product offering. Service may not operate correctly and may be substantially modified prior to its first public release, or withdrawn. Service is provided "AS IS" without warranty of any kind. The entire risk arising out of the use of Service remains with Licensee. In no event shall the Company be liable for any damage whatsoever arising out of the use of or inability to use Service.</p>
            <p>Licensee agrees that the laws of the State of Pennsylvania shall govern the terms of this Agreement.</p>
          </div>
        </Page>
      </PageInitializer>
    );
  } 
}

export default TermsOfServicePage;
