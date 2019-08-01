import React from 'react';
import PropTypes from 'prop-types';
import forEach from 'lodash/forEach';
import get from 'lodash/get';
import { connect } from 'react-redux';

import { scrollToElement } from '../../utilities/StyleUtilities';

import './TextFinder.scss';

const MARKED_MATCH_CLASS_NAME = 'o-marked-match';
export function scrollToFirstMarkedMatchOnPage() {
  setTimeout(() => {
    const markedMatches = document.getElementsByClassName(MARKED_MATCH_CLASS_NAME);
    if(markedMatches.length > 0) {
      scrollToElement(markedMatches[0]);
    }
  }, 1000);
};

class TextFinder extends React.Component {

  static findMatches(string, matchTerms) {
    const results = [];
    const lowerCaseString = string.toLowerCase();

    forEach(matchTerms, term => {
      const lowerCaseTerm = term.toLowerCase();

      let indexOfMatch = lowerCaseString.indexOf(lowerCaseTerm);
      while(indexOfMatch >= 0) {
        const match = { start: indexOfMatch, end: (indexOfMatch + term.length) }
        results.push(match);

        // Setup for the next loop iteration
        indexOfMatch = lowerCaseString.indexOf(lowerCaseTerm, match.end);
      }
    });

    results.sort((a, b) => (a.start - b.start));

    return results;
  }

  static markMatch = (string, key) => (<span className={MARKED_MATCH_CLASS_NAME} key={key}>{string}</span>);

  parseString(string) {
    if (string === '') {
      return string;
    }

    const matches = TextFinder.findMatches(string, this.props.matchTerms);
    if (matches.length === 0) {
      return string;
    }

    const elements = [];
    let lastIndex = 0;
    matches.forEach((match, i) => {
      // Push preceding text if there is any
      if (match.start > lastIndex) {
        elements.push(string.substring(lastIndex, match.start));
      }

      const decoratedComponent = TextFinder.markMatch(string.substring(match.start, match.end), i);
      elements.push(decoratedComponent);

      lastIndex = match.end;
    });

    // Push remaining text if there is any
    if (string.length > lastIndex) {
      elements.push(string.substring(lastIndex));
    }

    return (elements.length === 1) ? elements[0] : elements;
  }

  parse(children, key) {
    if (typeof children === 'string') {
      return this.parseString(children);
    } 
    
    if ( // We have an element with children to potentially parse
      React.isValidElement(children) 
      && children.props && children.props.children
      && (children.type !== 'a') 
      && (children.type !== 'button')
    ) {
      return React.cloneElement(children, {key}, this.parse(children.props.children));
    } 
    
    // We have an array of elements
    if (Array.isArray(children)) {
      return children.map((child, i) => this.parse(child, i));
    }

    // No work to do here, pass back the element as it is
    return children;
  }

  render() {
    const shouldParse = (
      !this.props.disabled 
      && this.props.matchTerms
      && this.props.matchTerms.length > 0
    );

    return (
      <React.Fragment>
        {shouldParse ? this.parse(this.props.children) : this.props.children}
      </React.Fragment>
    );
  }
}

TextFinder.propTypes = {
  /**
   *  Defines the form elements in scope for AutoForm to handle data binding
   */
  children: PropTypes.oneOfType([
    PropTypes.element, 
    PropTypes.string, 
    PropTypes.bool,
    PropTypes.arrayOf(PropTypes.oneOfType([ PropTypes.element, PropTypes.string, PropTypes.bool ]))
  ]),

  disabled: PropTypes.bool
}

const mapStateToProps = (state) => {
  const textQuery = get(state, 'inPageFinderContext.textQuery', undefined);
  const matchTerms = textQuery ? textQuery.split(' ') : [];
  return { matchTerms };
}

export default connect(mapStateToProps)(TextFinder);