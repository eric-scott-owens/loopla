import React from 'react';
import PropTypes from 'prop-types';
import configuration from '../../configuration';
import './EmailPreview.scss';

const EmailPreview = ({ className, subject, children }) => (
  <div className={`o-email-preview ${className}`}>
    <div className="o-email-subject">Subject: &nbsp;
      <span className="o-email-subject-string">
        {subject}
      </span>
    </div>
    <div className="o-email-body">
      {children}
    </div>
    <div className="o-email-footer">
      Thanks,
      <br />

      Your Friends at Loopla
      <br />

      <hr />

      <a href="http://www.loopla.com" className="o-loopla-link">Loopla</a>{ ' ' }
      allows you to privately share useful information with people you know. No ads, no tracking, and no unwanted notifications or email.
      
      <br />
      <br />
      <img 
        src={`${configuration.SITE_RESOURCES_URL}/frontend_v1/media/logo/loopla_logo.png`}
        alt="Loopla Logo"
        width="110"
        height="auto" />
    </div>
  </div>
)

EmailPreview.propTypes = {
  className: PropTypes.string,
  subject: PropTypes.string,
  children: PropTypes.element
}

export default EmailPreview;
